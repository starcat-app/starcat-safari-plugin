# Safari App Review 资料

## App Review Notes 填写稿

将方括号替换为真实、可用且在审核期内有效的信息。

```text
This app contains a Safari Web Extension that is a companion for the Starcat macOS app. There is no cloud account or GitHub sign-in flow.

Test steps:
1. Install and open the Starcat macOS review build: [HTTPS URL].
2. In Starcat, open Settings > Integrations > Browser Plugin and enable the local service.
3. Copy the service URL and Local API Key from Starcat Settings > Integrations > Local API Key.
4. Open the Safari extension settings, enter the service URL and Local API Key, then click Test Connection.
5. Open [GitHub repository URL] to review the GitHub page surfaces.
6. Open [Google Search URL containing the same GitHub repository] to review “Open in Starcat” and Health badges.

The extension sends requests only to the Starcat Companion service on the same Mac (127.0.0.1). It does not call GitHub APIs or a remote Starcat service.
```

## 发布前人工验收

- [ ] 新建 Safari Profile 或清空扩展数据，安装候选 Packager 包。
- [ ] 未配对、错误 key、正确配对三种状态均验证。
- [ ] GitHub repo 页面显示预期的 Starcat 内容；未 Star 仓库不显示笔记编辑。
- [ ] Google 搜索页仅增强已 Star 的 GitHub 仓库结果，不破坏其他结果。
- [ ] 保存笔记后 Starcat App 内存在同一内容。
- [ ] `Open in Starcat` 能激活 App；Starcat 未运行时页面无异常。
- [ ] 关闭重开 Safari 后，配对状态与产品预期一致。
- [ ] Safari Web Extension Packager 的预生产包通过安装、启用和功能验收。

## 审核环境材料

- [ ] Starcat macOS 审核构建的 HTTPS 下载地址。
- [ ] 用于演示的公开 GitHub 仓库 URL 和 Google 搜索 URL。
- [ ] 审核联系人姓名、邮箱、电话。
- [ ] 对“需要 Starcat for macOS”的明确说明。
- [ ] 审核前确认所有截图、备注和打包产物均无真实 Local API Key 或私人内容。
