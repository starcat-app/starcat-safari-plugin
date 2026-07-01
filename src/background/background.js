/*
 * Starcat Safari background bridge.
 *
 * Safari applies page-like CORS checks to content scripts, so GitHub-injected
 * code cannot reliably fetch the local Starcat service directly. The background
 * worker owns loopback API calls because extension pages are allowed to use the
 * manifest host permissions for 127.0.0.1/localhost.
 */

(function () {
  const extensionAPI = globalThis.browser || globalThis.chrome;
  const STORAGE_KEYS = {
    serviceURL: "starcatCompanionServiceURL",
    port: "starcatCompanionPort",
    token: "starcatCompanionToken"
  };
  const DEFAULT_SERVICE_URL = "http://127.0.0.1:5001";

  function normalizeServiceURL(value) {
    const raw = String(value || "").trim();
    if (!raw) return DEFAULT_SERVICE_URL;

    try {
      const url = new URL(raw);
      const isLoopback = url.hostname === "127.0.0.1" || url.hostname === "localhost";
      if (isLoopback && url.port) {
        // The Companion server is intentionally HTTP-only on loopback. Keep the
        // scheme pinned here so stale Safari storage cannot force TLS.
        url.protocol = "http:";
        url.pathname = "";
        url.search = "";
        url.hash = "";
        return url.toString().replace(/\/$/, "");
      }
    } catch {
      // Invalid user input falls back to the local default.
    }
    return DEFAULT_SERVICE_URL;
  }

  function normalizeToken(value) {
    return String(value || "").trim();
  }

  async function loadConfig() {
    const stored = await extensionAPI.storage.local.get([
      STORAGE_KEYS.serviceURL,
      STORAGE_KEYS.port,
      STORAGE_KEYS.token
    ]);
    const migratedURL = stored[STORAGE_KEYS.serviceURL]
      || (stored[STORAGE_KEYS.port] ? `http://127.0.0.1:${stored[STORAGE_KEYS.port]}` : DEFAULT_SERVICE_URL);
    return {
      serviceURL: normalizeServiceURL(migratedURL),
      token: normalizeToken(stored[STORAGE_KEYS.token])
    };
  }

  async function requestLocal(path, options = {}) {
    const config = await loadConfig();
    if (!config.token) {
      throw new Error("missing_token");
    }

    const response = await fetch(`${config.serviceURL}${path}`, {
      method: options.method || "GET",
      body: options.body || undefined,
      headers: {
        "Authorization": `Bearer ${config.token}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    const text = await response.text();
    let body = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = { raw: text };
      }
    }

    if (!response.ok) {
      const error = new Error(body?.error || `http_${response.status}`);
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  }

  async function handleLocalRequest(message) {
    try {
      const body = await requestLocal(message.path, {
        method: message.method,
        body: message.body
      });
      return { ok: true, body };
    } catch (error) {
      return {
        ok: false,
        error: error.message || "request_failed",
        status: error.status || 0,
        body: error.body || null
      };
    }
  }

  function parseSSE(chunk) {
    const lines = chunk.split("\n");
    let type = "message";
    let data = "";
    for (const line of lines) {
      if (line.startsWith(":")) continue;
      if (line.startsWith("event:")) type = line.slice(6).trim();
      if (line.startsWith("data:")) data += line.slice(5).trim();
    }
    if (!data) return null;
    try {
      return { type, data: JSON.parse(data) };
    } catch {
      return null;
    }
  }

  function safePostMessage(port, message) {
    try {
      port.postMessage(message);
    } catch {
      // GitHub soft navigation can disconnect the content-script port while the
      // local event stream is still unwinding. Dropping the stale message is OK.
    }
  }

  async function streamEventsToPort(port, subscriptionID, repoID, controller) {
    try {
      const query = new URLSearchParams();
      if (repoID) query.set("repo_id", String(repoID));
      const response = await requestEventStream(`/plugin/v1/events?${query.toString()}`, controller.signal);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (!controller.signal.aborted) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const event = parseSSE(part);
          if (event) {
            safePostMessage(port, { type: "starcat.event", subscriptionID, event });
          }
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        safePostMessage(port, {
          type: "starcat.event.error",
          subscriptionID,
          error: error.message || "events_failed"
        });
      }
    }
  }

  async function requestEventStream(path, signal) {
    const config = await loadConfig();
    if (!config.token) {
      throw new Error("missing_token");
    }
    const response = await fetch(`${config.serviceURL}${path}`, {
      headers: {
        "Authorization": `Bearer ${config.token}`,
        "Accept": "text/event-stream"
      },
      signal
    });
    if (!response.ok || !response.body) {
      throw new Error(`events_http_${response.status}`);
    }
    return response;
  }

  extensionAPI.runtime.onMessage.addListener((message) => {
    if (message?.type !== "starcat.localRequest") return false;
    return handleLocalRequest(message);
  });

  extensionAPI.runtime.onConnect.addListener((port) => {
    if (port.name !== "starcat.events") return;

    const controllers = new Map();
    port.onMessage.addListener((message) => {
      if (message?.type === "open") {
        const controller = new AbortController();
        controllers.set(message.subscriptionID, controller);
        streamEventsToPort(port, message.subscriptionID, message.repoID, controller);
        return;
      }
      if (message?.type === "close") {
        controllers.get(message.subscriptionID)?.abort();
        controllers.delete(message.subscriptionID);
      }
    });

    port.onDisconnect.addListener(() => {
      for (const controller of controllers.values()) {
        controller.abort();
      }
      controllers.clear();
    });
  });
})();
