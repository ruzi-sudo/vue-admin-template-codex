# Vue Admin Template Skills

这是一个可独立发布到 GitHub 的 Codex plugin。它完整内置 Vue 管理后台模板所需的 skills，不依赖原项目、外部 skill 目录或用户机器上的技能目录。

## Plugin structure

```
.
├─ plugin.json
├─ .codex-plugin/plugin.json
├─ .agents/plugins/marketplace.json
├─ skills/
│  ├─ ui-template/
│  │  ├─ SKILL.md
│  │  ├─ references/
│  │  └─ assets/vue-admin-template/
│  ├─ element-plus-skills/
│  ├─ tailwind-design-system/
│  ├─ typescript-best-practices/
│  ├─ vite/
│  ├─ vitest/
│  └─ vue-*/
├─ skills-index.md
├─ skills-index.json
└─ LICENSE
```

`ui-template` 是项目规范入口。它的主路径是从空目录、半成品或不符合目标约束的项目重构出目标架构；次路径是把按其他标准开发的现有项目迁移到该架构。安装插件后，先读取 `skills/ui-template/SKILL.md`，再按任务加载其他 skill。新建项目时复制[内置 Vue 后台模板](skills/ui-template/assets/vue-admin-template/README.md)的内容到目标根目录。已有项目可以按任务对照其中的页面、路由、API、Mock 和测试。

## Publish to GitHub

把本目录（包含 `.codex-plugin/`、根目录 `plugin.json`、`.agents/` 和 `skills/`）作为 GitHub repository 根目录发布。不要只上传 manifest；`skills/` 及其 `reference` 文件是插件运行所需内容。

发布前检查：

```bash
pnpm exec prettier --check .
```

并确认：

- 根目录 `plugin.json` 的 `$schema` 和 `name` 有效。
- `.codex-plugin/plugin.json` 保留用于旧版 Codex 的兼容入口，且 `skills` 为 `./skills/`。
- `.agents/plugins/marketplace.json` 使用 `source: "local"` 和 `path: "./"`，因为插件位于仓库根目录；通过 GitHub marketplace 添加仓库时，Codex 会获取该 marketplace 及其根目录插件。
- `skills/` 下的 `SKILL.md` 和 reference 文件完整存在。
- 技能 Markdown 没有指向插件外部的相对链接，也没有工作区绝对路径。

## Install from GitHub

### Codex CLI

GitHub 仓库地址是 `ruzi-sudo/vue-admin-template-codex`，在任意工作目录执行：

```bash
codex plugin marketplace add ruzi-sudo/vue-admin-template-codex --ref main
codex plugin list
codex plugin add vue-admin-template-skills@vue-admin-template
```

也可以打开 Codex CLI 的插件浏览器：

```text
codex
/plugins
```

安装后启动新会话，Agent 才会加载新安装的 skills。若仓库是私有仓库，先让 Git 凭据能够访问该仓库；插件本身不包含任何凭据或安装脚本。

### 本地测试

在插件仓库根目录执行：

```bash
codex plugin marketplace add .
codex plugin list
codex plugin add vue-admin-template-skills@vue-admin-template
```

### ChatGPT / Codex 桌面端

桌面端通过 **Plugins** 目录安装；如果需要团队共享，由管理员从 GitHub marketplace 导入并同步。IDE 扩展目前不支持插件。

安装后，直接描述 Vue 管理后台任务即可；需要明确指定时使用 `@Vue Admin Template` 或技能名称。插件的入口技能是 `skills/ui-template/SKILL.md`，Agent 会按任务继续读取对应技能。

## Agent 自动安装的边界

GitHub 仓库可以让 Agent **发现并安装**这个插件，但出于权限和供应链安全，Agent 不会在没有用户授权的情况下自行修改 Codex marketplace 配置或安装插件。推荐把下面的命令交给 Agent 执行，并在 Codex 的安装确认中批准：

```text
请从 ruzi-sudo/vue-admin-template-codex 的 main 分支添加 Codex marketplace，检查可用插件，并安装 vue-admin-template-skills。安装后开始新会话，再按 Vue Admin Template skill 工作。
```

本插件提供技能指令和可独立复制的应用模板，不会自动修改目标 Vue 项目、安装 npm 依赖或执行 hooks；项目依赖仍由 Agent 根据任务和用户确认处理。

## License

本插件沿用仓库中的 MIT license。第三方技能的来源和许可说明保留在各自 skill 文件及索引元数据中。
