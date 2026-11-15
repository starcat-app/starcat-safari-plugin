# Security Policy

## Supported Versions

Security fixes target the latest published version of Starcat Safari Plugin.

## Security Boundary

Starcat Safari Plugin is a browser extension that talks to the Starcat app through a local loopback HTTP API:

```text
http://127.0.0.1:{port}/plugin/v1
```

The extension must not:

- Expose the Starcat Local API Key in logs, page DOM, URLs, or remote requests.
- Send Starcat private notes to any remote service.
- Call GitHub, OpenSSF, AI providers, or Starcat backend services directly.
- Broaden host permissions beyond the minimum needed for GitHub pages and `127.0.0.1`.

## Reporting a Vulnerability

Please report security issues through [GitHub Security Advisories](https://github.com/starcat-app/starcat-safari-plugin/security/advisories/new) before opening a public issue.

Include:

- Affected version or commit.
- Steps to reproduce.
- Expected and actual behavior.
- Any relevant browser, macOS, and Starcat app versions.

## Local API Key Handling

New pairing uses a per-device Companion token stored in extension-origin IndexedDB. Only the extension's own pairing tab controls requests; content scripts receive neither claim secrets nor new tokens. Six digits are for human comparison and are not authentication credentials. App approval permits a one-time claim.

Safari currently uses background HTTP without a CLI native host. Its legacy manual Key storage lacks Chrome's trusted-context restriction. Revoking the device in Starcat invalidates new requests and its event streams; deleting local configuration alone does not revoke app authorization.

The Starcat Local API Key authorizes only local loopback API access. Treat it as a secret:

- Do not publish it in screenshots, bug reports, or logs.
- Rotate it from the Starcat app if it may have leaked.
- Do not reuse GitHub tokens, AI keys, or Starcat backend API keys as the Starcat Local API Key.
