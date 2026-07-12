# Safari App Privacy 核对表

## 当前数据流

```text
GitHub / Google Search 页面
  → content script 读取当前 URL、GitHub 仓库链接与必要 DOM
  → Safari background worker
  → http://127.0.0.1:{port}/plugin/v1/*（Bearer Local API Key）
  → 同一台 Mac 上运行的 Starcat App
```

Safari background worker 承担 loopback 请求，是为了避免 content script 的页面 CORS 限制。扩展不请求 GitHub API、Starcat 后端、AI provider、OpenSSF、广告或分析服务。

## App Privacy 填写依据

| 数据 | 当前实现 | 提交时必须说明 |
|---|---|---|
| 当前 URL、GitHub 仓库链接、必要 DOM | 识别仓库、在 GitHub 与 Google 搜索页渲染 UI | 只在设备本地处理；仅 owner/repo 会发给同机 Starcat，不上传完整页面。 |
| Local API Key | 在 extension local storage 保存，作为本机请求 Bearer token | 仅为同一 Mac 的 Companion API 认证；不是 GitHub token 或远端账号凭据。 |
| 用户主动保存的笔记 | 点击保存后交给同机 Starcat App | 插件不持久化笔记正文，也不共享给第三方。 |
| Google 搜索页结果 | 最多识别 8 条可见 GitHub 仓库结果 | 仅已 Star 仓库显示 `Open in Starcat` 和 Health。 |

## 提交前必做核验

- [ ] App Privacy 不得填写为“完全不处理数据”；本地处理也需要按 Apple 问卷和公开隐私政策准确说明。
- [ ] 核验 Local API Key 在 Safari extension storage 中的持久化策略是否满足 Apple 的安全与隐私要求。
- [ ] `PRIVACY.md`、App Store Connect Privacy Policy URL、App Privacy 问卷和 `STORE_LISTING.md` 的描述一致。
- [ ] 若新增远端服务、遥测、第三方 SDK 或更多页面权限，先更新这份资料和公开声明，再修改提交包。

## 不可使用的表述

- “只在 GitHub 页面运行”。
- “不处理网页内容或浏览活动”。
- “不会保存认证信息”。
- “不会收集数据”，除非重新核验当前实现与 Apple 问卷后确实成立。
