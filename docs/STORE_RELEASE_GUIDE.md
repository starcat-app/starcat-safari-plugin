# Safari App Store 上架指导

> 此文件已迁入 `docs/`，由 [发布资料索引](README.md) 统一导航。

> 适用仓库：`starcat-safari-plugin`
> 当前源码基线：`manifest.json` 的 `0.1.0`
> 最后核对：2026-07-12
> 目标渠道：macOS App Store 的 Safari Extensions 分类

本文档针对官方 App Store 分发，不适用于“Allow Unsigned Extensions”或临时加载。Safari 源码目录本身不是可直接提交的商店产物，必须先经 Safari Web Extension Packager / App Store Connect 生成和提交可审核的 Safari Web Extension 包。

## 1. 发布结论与分发路径

当前状态为 **不可以直接提交（No-Go）**。`starcat-safari-plugin` 已具备 MV3 源码与 Safari background worker，但尚未看到 App Store Connect 包、商店截图、审核资料或正式版本。

选择并固定一条官方路径：

1. 使用 Safari Web Extension Packager 将已验证的源码包打包，并在 App Store Connect 创建 / 关联 macOS App 记录；或
2. 若未来转为 Xcode containing app 路线，使用包含 Safari Web Extension target 的 macOS App archive 上传。

本项目当前应优先采用路径 1。不要同时维护两个不同的商店包，也不要把本地临时加载步骤作为上架说明。

## 2. 当前源码事实（提交资料的唯一依据）

| 项目 | 当前事实 | App Store 资料中的表述 |
|---|---|---|
| Manifest | Manifest V3，版本 `0.1.0` | Safari Web Extension |
| 权限 | `storage` | 保存服务地址与 Local API Key，供用户完成本地配对 |
| 页面范围 | `github.com`、Google 各地区 `/search` 页 | 不能写成“仅 GitHub” |
| Host 权限 | GitHub、Google 搜索域名、`127.0.0.1`、`localhost` | 解释为页面增强与同机 Starcat 通信 |
| Safari 结构 | `src/background/background.js` 代为调用 loopback API | Safari content script 不直接处理本机 API CORS |
| 页面读取 | 当前 URL、GitHub 仓库链接与必要 DOM；Google 页最多识别 8 条 GitHub 仓库结果 | 用于定位仓库并放置 Starcat 入口，不上传整页内容 |
| 本机通信 | 仅 `http://127.0.0.1:{port}/plugin/v1/*`，Bearer Local API Key | 不连接 GitHub API、Starcat 后端、AI provider 或 OpenSSF |
| 用户生成内容 | 用户主动保存的笔记内容会发送到本机 Starcat | Safari 插件自身不持久化笔记正文 |

Google 搜索页是已实现功能：已 Star 的 GitHub 结果会出现 `Open in Starcat` 与 Health 徽标。因此 App Store 描述、隐私政策和审核备注都必须包含这项能力。若产品决定只支持 GitHub，必须在提交前改代码与 manifest，不可只改文案。

## 3. 上架阻断项

- [ ] `README.md`、`README-ZH.md`、`PRIVACY.md`、App Store 描述全部覆盖 GitHub 与 Google 搜索页。
- [ ] 对 `storage`、Google / GitHub 页面读取、Local API Key 和笔记本机写入完成隐私审查，并使 App Privacy 与公开隐私政策一致。
- [ ] 确认 extension storage 中的 Local API Key 保护方案符合 Apple 的安全与隐私要求；不能只因数据不离开设备而跳过评估。
- [ ] 用干净 Safari Profile 验收：未配对、错误 key、正确配对、GitHub 页面、Google 搜索页面、保存笔记、Open in Starcat、退出 Starcat App。
- [ ] 用 Safari Web Extension Packager 做一次预生产打包，解决所有 manifest / 签名 / 资源校验错误。
- [ ] 准备可供 App Review 安装的 Starcat macOS 审核构建，以及从 App 内打开本机服务、复制 Local API Key 的完整路径。
- [ ] 准备 App Store 图标、至少一张真实 macOS 截图、隐私政策 URL、支持 URL 和审核备注。
- [ ] 审核通过前不得将临时开发签名、未签名扩展或测试 key 当成公开发布产物。

## 4. App Store Connect 建档

### 4.1 App record

| 字段 | 建议值 |
|---|---|
| Platform | macOS |
| App name | `Starcat Safari Plugin`（若与 Packager 产物一致） |
| Primary language | English (U.S.)，再补简体中文本地化 |
| Bundle ID | 从 Packager 生成的正式包中确认；不得凭源码目录猜测 |
| SKU | 稳定且不含个人数据，例如 `starcat-safari-plugin-macos` |
| Category | Productivity；如后台可选 Safari Extensions，以实际可选项为准 |
| Age rating | 按实际内容如实完成问卷；不要仅因是工具而跳过 |

在创建记录前，确认 Apple Developer Program 和 App Store Connect 的最新协议已经由 Account Holder 接受。

### 4.2 Product page 英文文案

**Subtitle（建议）**

```text
Bring Starcat context to GitHub
```

**Description（建议）**

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

**Keywords（建议，提交前查重）**

```text
GitHub,repository,notes,developer,knowledge,Starcat
```

不要加入 `AI`、`GitHub official`、`best`、`fastest`、竞争产品名称或当前版本没有的功能。

## 5. App Privacy 与公开隐私政策

App Store Connect 的 App Privacy 覆盖提交包内的全部代码与第三方 SDK。这个 Safari 包没有分析/广告 SDK，但仍处理浏览活动、认证信息和用户笔记内容；不能填写“不会收集数据”来简化审核。

提交前由产品负责人按实际 App Privacy 问卷字段逐项核对；以下为当前代码对应关系：

| 数据 | 实际用途 | 传输 / 保存 | 必须说明 |
|---|---|---|---|
| 当前 URL、GitHub 仓库链接、必要页面 DOM | 识别仓库、注入上下文与搜索结果入口 | 只在设备本地处理；仅仓库 owner/repo 会发给 loopback Starcat | 不跟踪、不做广告、不发送完整页面到远端 |
| Local API Key | 对本机 Companion API 的 Bearer 认证 | 保存在 Safari 扩展 local storage；仅随本机请求发送 | 不是 GitHub token，也不是 Starcat 云端账号凭据 |
| 用户主动保存的笔记 | 写入用户的 Starcat 本地知识库 | 点击保存时发给同机 Starcat；扩展不存正文 | 不共享给第三方 |

公开隐私政策必须有可公开、稳定的 HTTPS URL，并且至少说明：收集/处理的数据、用途、是否共享、是否跟踪、用户如何清除配对资料和笔记。仓库 `PRIVACY.md` 可以是内容源，但在没有长期公开 URL 前不能替代 App Store Connect 的 Privacy Policy URL。

## 6. App Review 说明

在 App Review Information 中填写可联系的审核联系人，并提供下面的 Notes 初稿。方括号必须替换为真实、可用的信息。

```text
This app contains a Safari Web Extension that is a companion for the Starcat macOS app. There is no cloud account or GitHub sign-in flow.

Test steps:
1. Install and open the Starcat macOS review build: [HTTPS URL].
2. In Starcat, open Settings > Integrations > Browser Plugin and enable the local service.
3. Copy the service URL and Local API Key from Starcat Settings > Integrations > Local API Key.
4. Open the Safari extension settings, enter the service URL and Local API Key, then click Test Connection.
5. Open [GitHub repository URL] to review the GitHub page surfaces.
6. Open [Google Search URL containing the same GitHub repository] to review “Open in Starcat” and Health badges.

The extension reads the minimum GitHub repository-link and rendered-page context required to place these features. Requests go only to the Starcat Companion service on the same Mac (127.0.0.1). It does not call GitHub APIs or a remote Starcat service.
```

审核员无法按步骤取得可运行的 Starcat App、可用 Local API Key 和测试 URL 时，提交通常无法有效验证；先补齐审核环境，不要以“功能依赖本地 App”为由省略说明。

## 7. 截图、图标和预览

macOS App Store 截图必须为 16:10：`1280×800`、`1440×900`、`2560×1600` 或 `2880×1800`。建议统一使用 `2880×1800 PNG`，按英文和简体中文分别截取。

建议资产清单：

```text
store-assets/
  safari-01-pairing-2880x1800.png
  safari-02-github-context-2880x1800.png
  safari-03-private-notes-2880x1800.png
  safari-04-code-menu-2880x1800.png
  safari-05-google-results-2880x1800.png
  app-store-icon-1024.png
```

截图必须展示真实 Safari UI 和真实插件功能，不能包含 Local API Key、私人笔记、GitHub token、测试账号或未发布功能。图标应来自正式包内 App Icon；不要直接把小尺寸 extension PNG 放大为 App Store 图标。

## 8. 打包、上传与提交

以下是正式发布流程，不要在未经确认的日常开发中执行。

1. 先运行源码检查并完成第 3 节全部人工验收项。
2. 在 Safari Web Extension Packager 中选择本仓库根目录（其中 `manifest.json` 在根部），按界面要求生成 App Store Connect 可上传包；记录 Packager 版本、生成的 bundle identifier 和版本号。
3. 在 App Store Connect 创建或更新 macOS App record，上传生成包并等待 Processing 完成。
4. 填写版本信息、描述、关键词、支持 URL、公开 Privacy Policy URL、App Privacy、年龄分级、价格与地区、截图和 App Review Information。
5. 对照最终上传包复查版本、权限、截图和审核备注；选中正确 build 后 Add for Review，再 Submit for Review。
6. 保存提交包哈希、版本号、App Store Connect build number、提交时间和审核沟通记录。

如改走 Xcode containing-app 路线，必须另行建立适用于该工程的签名、archive 与上传操作文档；不要把 Packager 的输出约定混用到 Xcode target。

## 9. 版本与回滚

- 每个商店版本递增 `manifest.json` 的 `version`，同步更新 `CHANGELOG.md` 和 App Store Connect version/build。
- 修改站点权限、Local API Key 保存方式、笔记写入或数据流时，必须同步更新公开隐私政策、App Privacy 和审核备注后再提交。
- 发现权限/隐私声明不实或审核误解时，停止该版本公开发布；修正实现与资料后以新 build 重新审核，而不是只改商品页文字。

## 10. 官方参考

- Safari Web Extension 分发：<https://developer.apple.com/documentation/safariservices/packaging-and-distributing-safari-web-extensions-with-app-store-connect>
- Safari Extensions：<https://developer.apple.com/safari/extensions/>
- 新建 App record：<https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app/>
- App Privacy：<https://developer.apple.com/app-store/app-privacy-details/>
- macOS 截图规格：<https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications>
- 提交审核：<https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app>
