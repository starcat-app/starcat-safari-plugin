# Starcat Safari Plugin

<!-- starcat-promo:start -->
<div align="center">
<a href="https://starcat.ink"><img src="https://raw.githubusercontent.com/starcat-app/starcat-site/main/assets/banner.webp" width="100%" alt="Starcat" /></a>

<p><strong>Safari WebExtension companion package that brings Starcat context to GitHub pages.</strong></p>
<p>Starcat is a native macOS app that turns GitHub Stars into a searchable, organized and AI-assisted local knowledge base, with a broader ecosystem of desktop clients, plugins, CLI tools, and self-hostable services.</p>

<a href="https://github.com/starcat-app/homebrew-starcat"><img src="https://img.shields.io/badge/Install%20with-Homebrew-FBBF24?style=for-the-badge&logo=homebrew&logoColor=white" width="220" alt="Install with Homebrew"/></a>
<br/>
<sub><a href="./README-ZH.md">中文说明</a></sub>
</div>

<div align="center">
<a href="https://starcat.ink"><img src="https://img.shields.io/badge/website-starcat.ink-38BDF8?style=flat&color=blue" alt="website"/></a>
<a href="https://github.com/starcat-app/Starcat/issues"><img src="https://img.shields.io/github/issues/starcat-app/Starcat?style=flat&color=blue" alt="issues"/></a>
<a href="https://github.com/starcat-app/homebrew-starcat"><img src="https://img.shields.io/badge/install-homebrew-lightgrey.svg?style=flat&color=blue" alt="homebrew"/></a>
<a href="https://github.com/starcat-app/starcat-localization"><img src="https://img.shields.io/badge/localization-open-lightgrey.svg?style=flat&color=blue" alt="localization"/></a>
</div>

<div align="center">
<img width="900" src="https://raw.githubusercontent.com/starcat-app/starcat-site/main/assets/main.webp" alt="Starcat main window"/>
</div>

**Preferred install method:**

```bash
brew tap starcat-app/starcat
brew trust starcat-app/starcat
brew install --cask starcat
```

**Useful links:**

- Home and downloads: https://starcat.ink
- Mac App Store: search for Starcat for GitHub
- Public support: https://github.com/starcat-app/Starcat/issues · Release notes: https://starcat.ink/changelog.html
- Starcat App Homebrew tap: https://github.com/starcat-app/homebrew-starcat
- CLI / MCP: [starcat-cli](https://github.com/starcat-app/starcat-cli) / [Homebrew tap](https://github.com/starcat-app/homebrew-starcat-cli)
- AI Agent Skill: https://github.com/starcat-app/starcat-skill
- Browser plugins: [Chrome](https://github.com/starcat-app/starcat-chrome-plugin) / [Safari](https://github.com/starcat-app/starcat-safari-plugin)
- Launcher integrations: [Alfred](https://github.com/starcat-app/starcat-alfred-workflow) / [uTools](https://github.com/starcat-app/starcat-utools-plugin) / [Raycast](https://github.com/starcat-app/starcat-raycast-extension)
- Documentation: https://github.com/starcat-app/starcat-docs
- Website source: https://github.com/starcat-app/starcat-site
- Localization: https://github.com/starcat-app/starcat-localization

**Self-hostable support APIs:**

- [starcat-sharing-api](https://github.com/starcat-app/starcat-sharing-api)
- [starcat-trending-api](https://github.com/starcat-app/starcat-trending-api)
- [starcat-weekly-api](https://github.com/starcat-app/starcat-weekly-api)
- [starcat-wiki-api](https://github.com/starcat-app/starcat-wiki-api)
- [starcat-recommend-api](https://github.com/starcat-app/starcat-recommend-api)
- [starcat-discovery-api](https://github.com/starcat-app/starcat-discovery-api)
<!-- starcat-promo:end -->

Starcat Safari Plugin enhances GitHub repository pages and Google search results with context already stored in Starcat. It can show local Starcat entry points and Health information for starred GitHub repositories without directly accessing the GitHub API, Starcat backends, OpenSSF, or an AI provider.

## Features

- Show similar repository recommendations on GitHub repository pages.
- Link to known Wiki providers.
- Read and save private Starcat notes.
- Display Health and OpenSSF scores cached by Starcat.
- Trigger CodeFlow and Codebase actions in the Starcat app.
- Add `Open in Starcat` and Health badges to starred GitHub repositories in Google search results.

## Load Locally

1. Open Safari Settings → Advanced and enable Show features for web developers.
2. Open Develop in the menu bar and enable Allow Unsigned Extensions.
3. Open Safari Settings → Extensions, choose Add Temporary Extension, and select `supports/extensions/starcat-safari-plugin`.
4. In Starcat, open Settings → Extensions & Connections → Browser Extensions and enable Browser Plugin Service.
5. Open Connect to Starcat from the extension, choose the discovered app, and click Connect in the pairing tab.
6. Compare the six digits in both windows and approve the matching request in Starcat.

The pairing tab stays open while switching to Starcat. Discovery checks the saved address and the single default port `5051`; custom addresses and manual Keys remain available in advanced settings. Discovery does not request approval.

Discovery has a five-second total budget, with saved/default HTTP addresses probed in parallel for up to 1.3 seconds each. Pairing shows a countdown to the app's 120-second deadline, clears the code on expiry, and ignores late replies. Connection requests time out after five seconds and are never automatically replayed. Errors distinguish discovery timeout, rejection, expiry, connection timeout, and credential storage failure.

Use **Use a Key to connect** on the pairing page for manual authentication. Copy the Key from Starcat → Settings → Extensions & Connections → Browser Extensions → Local API Key. The same page shows the service address. Unpair an already paired browser before switching to a manual Key.

## Communication Boundary

The background owns pairing, Companion requests, and event streams through the app's local HTTP service. Safari currently has no CLI native host integration:

```text
http://127.0.0.1:{port}/plugin/v1
```

Every business request requires:

```text
Authorization: Bearer <browser-device-token-or-manual-key>
```

Pairing issues an independent revocable token stored in extension-origin IndexedDB; new device tokens and pairing secrets are never returned to content scripts. Starcat records device names and pairing/access times. Unpair browser revokes server authorization; Clear locally only does not, and requires later revocation in Starcat when offline. Legacy manual Keys remain in extension storage; Safari lacks Chrome's trusted-context storage restriction, so manual Key authentication does not provide the new token isolation.

## Repository Layout

| Path | Purpose |
|---|---|
| `manifest.json` | Safari WebExtension MV3 entry manifest. |
| `LICENSE` | Open-source license. |
| `PRIVACY.md` | Privacy and data-boundary documentation. |
| `SECURITY.md` | Security boundaries and vulnerability reporting. |
| `CONTRIBUTING.md` | Local development and contribution guidelines. |
| `CHANGELOG.md` | Version history. |
| `src/shared/shared.js` | Configuration storage, GitHub repository URL parsing, and local API client. |
| `src/background/background.js` | Controlled pairing, credentials, loopback requests, and SSE proxy. |
| `src/pairing/` | Stable six-digit pairing tab, discovery, and unpairing. |
| `src/popup/` | Quick-pairing popup shown when the toolbar icon is left-clicked. |
| `src/options/` | Endpoint port, Local API Key, and connection testing. |
| `src/content/` | Page injection and rendering for GitHub repositories and Google search results. |
| `docs/` | Store submission materials, privacy disclosures, review notes, and asset requirements. |

## Release Materials

Read [docs/README.md](docs/README.md) before preparing a store release. Historical store materials require a pairing/privacy review, containing-app validation, and real browser acceptance before submission. Source implementation does not remove the release No-Go.

## Validation

```bash
python3 -m json.tool supports/extensions/starcat-safari-plugin/manifest.json >/dev/null
node --check supports/extensions/starcat-safari-plugin/src/shared/shared.js
node --check supports/extensions/starcat-safari-plugin/src/popup/popup.js
node --check supports/extensions/starcat-safari-plugin/src/options/options.js
node --check supports/extensions/starcat-safari-plugin/src/content/content-script.js
node --check supports/extensions/starcat-safari-plugin/src/background/background.js
node --check supports/extensions/starcat-safari-plugin/src/pairing/pairing.js
```
