# AGENTS.md — Starcat Safari Plugin 协作规范

本文档是本仓库 AI 协作规则的唯一维护源。

## 规则继承与独立仓边界

开工前按顺序阅读：

1. 本仓库 `AGENTS.md`；
2. 上级 [`../AGENTS.md`](../AGENTS.md)，了解 Chrome / Safari 扩展共用约束；
3. 上上级 [`../../AGENTS.md`](../../AGENTS.md)，了解 `supports/` 独立项目边界与全局规则。

本目录是独立 Git 仓库，拥有自己的 remote、分支、提交和发布边界。任何操作都必须在
本仓库内完成；不得把改动并入外层 Starcat 主仓库，也不得顺手修改相邻
`starcat-chrome-plugin` 或上级目录。跨端同步需要进入对应独立仓库分别修改、验证和提交。

## 技术栈与运行边界

- Safari WebExtension，使用 Manifest V3。
- 源码为原生 JavaScript、HTML、CSS，无依赖安装、转译或构建步骤。
- `manifest.json` 是扩展入口；`src/shared/`、`src/content/`、`src/popup/`、
  `src/options/` 分别负责 Companion client、页面注入、快速配对和完整设置。
- Safari 端通过 `globalThis.browser || globalThis.chrome` 兼容扩展 API；
  `src/background/background.js` 统一代理请求、SSE、配对与凭据，`src/pairing/` 为稳定配对标签页。
- 插件只允许访问 Starcat macOS App 暴露的
  `http://127.0.0.1:{port}/plugin/v1/*` 或等价 `localhost` loopback 地址，
  并使用独立 Companion 设备 token 或高级设置中的 Local API Key。禁止改为远程服务，也不要把它与 GitHub token、AI key 或
  Starcat 后端 API key 混用。

## Chrome / Safari 双端同步

Safari 与 Chrome 的产品行为必须保持一致。修改功能、Manifest 权限、Companion API
契约、content script、样式、popup、options 或素材时，必须检查
`../starcat-chrome-plugin` 是否需要同步；除非需求明确限定单端，否则两仓分别实施。

同步时保留平台差异：Safari content script 受更严格的页面上下文 CORS 约束，
loopback 请求、SSE 与新设备凭据必须经 background；Chrome 同样使用后台代理，并可选
CLI Native Messaging。Safari 当前未接入 CLI 原生宿主，不得照搬 Chrome host 安装流程。
新 token 只放扩展 origin IndexedDB，content 不获取 token；Safari 没有 Chrome 的
storage 可信上下文限制，旧手工 Key 的存储约束必须如实保留。

## 验证

本项目没有构建命令。至少执行：

```bash
python3 -m json.tool manifest.json >/dev/null
node --check src/shared/shared.js
node --check src/background/background.js
node --check src/content/content-script.js
node --check src/popup/popup.js
node --check src/options/options.js
node --check src/pairing/pairing.js
git diff --check
```

涉及页面行为时，再通过 Safari 的 Add Temporary Extension 加载本目录进行人工验证。

## 发布 No-Go

Safari App Store 发布属于 No-Go。未经 dong4j 在当前任务中明确授权，禁止打包扩展或
宿主 App、创建或推送 tag、上传 Safari App Store / App Store Connect、发布版本或
执行任何等价分发操作；也不得 commit 或 push。仅修改发布脚本或文档不构成执行发布的授权。
