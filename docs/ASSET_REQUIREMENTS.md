# Safari App Store 素材清单

截图必须是真实的待提交版本 Safari 界面，且不能显示 Local API Key、私人笔记、测试账号、GitHub token 或未发布功能。

## 必备文件

| 文件 | 规格 | 内容 |
|---|---|---|
| `safari-01-pairing-2880x1800.png` | 2880×1800 PNG | Safari 扩展配对入口；Key 必须遮挡。 |
| `safari-02-github-context-2880x1800.png` | 2880×1800 PNG | GitHub repo 页的推荐、笔记或健康信息。 |
| `safari-03-private-notes-2880x1800.png` | 2880×1800 PNG | 已 Star 仓库的笔记编辑/保存状态。 |
| `safari-04-code-menu-2880x1800.png` | 2880×1800 PNG | GitHub Code 菜单或打开 Starcat 动作。 |
| `safari-05-google-results-2880x1800.png` | 2880×1800 PNG | Google 搜索页的 `Open in Starcat` 与 Health 徽标。 |
| `app-store-icon-1024.png` | 1024×1024 PNG | 来自正式 Packager / containing app 的 App Icon。 |

macOS 截图必须保持 16:10；可用规格为 `1280×800`、`1440×900`、`2560×1600` 或 `2880×1800`。本项目建议统一使用 `2880×1800`。

## 保存位置与检查

将实物放进 `docs/assets/`，上传时使用这些文件，**不要**把它们或 App Store 图标直接放入 WebExtension 运行时 ZIP。

- [ ] 画面清晰、真实、无拉伸和敏感信息。
- [ ] 至少有一张 GitHub 和一张 Google 搜索页截图，证明权限用途。
- [ ] App Store 名称、图标、截图、描述与最终 Packager 包一致。
- [ ] 每份素材记录来源版本，避免商店沿用过期界面。
