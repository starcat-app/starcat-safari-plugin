# Safari App Store 发布资料

本目录保存 Safari App Store 上架准备资料，不是 Safari 临时加载说明，也不会替代 Safari Web Extension Packager 的正式产物。

| 文件 | 用途 |
|---|---|
| [STORE_RELEASE_GUIDE.md](STORE_RELEASE_GUIDE.md) | Packager、App Store Connect 与提交流程。 |
| [STORE_LISTING.md](STORE_LISTING.md) | App Store Connect 字段可粘贴文案。 |
| [PRIVACY_DISCLOSURE.md](PRIVACY_DISCLOSURE.md) | App Privacy、权限与数据流核对。 |
| [REVIEW_KIT.md](REVIEW_KIT.md) | App Review 测试说明与人工验收。 |
| [ASSET_REQUIREMENTS.md](ASSET_REQUIREMENTS.md) | Mac 截图、App Store 图标和素材清单。 |
| [IMPLEMENTATION_GAPS.md](IMPLEMENTATION_GAPS.md) | 提交前必须决定或修改的实现项。 |
| `assets/` | 人工生成的商店素材存放位置；不得放入密钥或真实私人笔记。 |

## 使用顺序

1. 先解决 `IMPLEMENTATION_GAPS.md` 的阻断项，再完成 `PRIVACY_DISCLOSURE.md` 的安全和隐私核验。
2. 在干净 Safari Profile 完成 `REVIEW_KIT.md` 的验收。
3. 使用 Safari Web Extension Packager 生成预生产包并修复其报告的问题。
4. 根据 `ASSET_REQUIREMENTS.md` 生成真实 App Store 素材。
5. 复制 `STORE_LISTING.md` 字段到 App Store Connect，并按 `STORE_RELEASE_GUIDE.md` 提交。

> 当前不能仅凭本目录发布：Google 搜索页权限、Local API Key 持久化策略、正式 Packager 包与 App Review 环境都必须完成验收。
