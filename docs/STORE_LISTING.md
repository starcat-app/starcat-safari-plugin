# Safari App Store Listing 填写稿

> 本文件是当前 `0.1.0` 功能的文案草稿。App Store Connect 的字段、可用分类和长度限制以提交当日页面为准。

## App record 基础字段

| 字段 | 建议值 |
|---|---|
| Platform | macOS |
| App name | `Starcat Safari Plugin` |
| Subtitle | `Bring Starcat context to GitHub` |
| Primary language | English (U.S.)，随后补简体中文本地化 |
| Category | Productivity；Safari Extensions 可选时以后台选项为准 |
| SKU | `starcat-safari-plugin-macos` |
| Bundle ID | 以 Safari Web Extension Packager 生成的正式包为准，不从源码目录推测 |
| Support URL | 公开、长期可访问的支持页或 GitHub Issues URL |
| Privacy Policy URL | 公开、长期可访问的 HTTPS 隐私政策 URL |

## Description

```text
Starcat Safari Plugin brings the repository context you already keep in the Starcat macOS app to GitHub repository pages and Google search results that link to GitHub repositories.

Pair the extension with Starcat running on your Mac to:

• View Starcat recommendations, private notes, repository health, and OpenSSF signals on GitHub repository pages.
• Open a repository or supported Starcat analysis workflow directly in Starcat.
• Show an “Open in Starcat” action and a health signal beside eligible GitHub repository results in Google Search.
• Save private notes to your local Starcat library.

The extension does not sign in to GitHub, call GitHub APIs, or send browsing data, notes, or API keys to Starcat servers. It communicates only with the Starcat Companion service on your own Mac.

Requires Starcat for macOS and one-time local pairing in the extension settings.
```

## Keywords

```text
GitHub,repository,notes,developer,knowledge,Starcat
```

## 发布前替换项

- [ ] 填写最终的正式 bundle identifier、支持 URL 和公开隐私政策 URL。
- [ ] 确认文案、截图、Packager 产物与版本号一致。
- [ ] 如移除 Google 搜索功能，同步删改本文件、隐私披露、截图和审核说明。
- [ ] 不声明 AI、自动采集、所有搜索引擎或未实现的跨设备能力。
