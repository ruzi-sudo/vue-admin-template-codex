---
name: tailwind-design-system
description: Use when implementing layout, spacing, responsive styles, theme tokens, or reusable UI patterns in this Vue 3, Element Plus, and Tailwind CSS v4 project.
metadata:
  source: Adapted from wshobson/agents tailwind-design-system; upstream provenance remains in skills-lock.json.
  scope: Project-curated Vue and Element Plus guide
---

# Tailwind Design System — 项目适用版

本指南根据当前完整项目与独立模板裁剪，保留已有 Tailwind CSS v4、Vue 和 Element Plus 的配合方式，并内置 Tailwind CSS v4 的语法与迁移规则。目录中的源码路径相对正在开发的项目根；先读目标项目的 `ui-template` 和 `src/style/tailwind.css`。本地内容经过项目适配，可独立作为模板开发规范使用。

## 设计依据

新增或改造自定义组件，包括从零实现、二次封装和业务组合，必须先读 [Element Plus 设计概览](../element-plus-skills/element-plus-design-overview/SKILL.md)。按涉及内容读取相应组件以及颜色、边框、布局、排版设计技能；沿用现有主题和邻近组件风格。

Tailwind 负责落实布局和样式。配色、尺寸、间距、圆角、阴影根据组件语义与设计资料选择，不在本技能定义另一套固定数值表。

## 当前项目约束

- 样式入口在 `src/main.ts`：reset → 公共样式 → Tailwind → Element Plus，修改时保留目标项目已有顺序。
- `src/style/tailwind.css` 分别导入 `tailwindcss/theme.css` 和 `tailwindcss/utilities.css`；保留当前层级与边框兼容样式。
- 颜色复用 `@theme` 中映射的 Element Plus 变量，暗色复用既有 `.dark` 变体和平台主题切换。
- 页面结构使用 Vue SFC 与 Element Plus；交互组件先复用已有组件及项目包装，再补充业务布局。
- 项目现有 ESLint 的 Tailwind 规则参与验收；以项目配置与相邻代码为准，修改后检查实际 class 写法。


## Tailwind v4 项目规则

- 当前项目固定使用 Tailwind CSS v4，新增样式优先采用 CSS-first 配置：`@theme` 定义可生成 utility 的 token，`@utility` 定义可变体化的自定义 utility，`@custom-variant` 定义变体，`@source` 处理额外扫描路径，`@reference` 支持 scoped Vue 样式中的 `@apply`。
- 当前项目保留 `src/style/tailwind.css` 的显式 `theme.css` / `utilities.css` 导入和既有层级；不要为了套用通用示例改成完整 Preflight 或另建 `tailwind.config.ts`。项目现有 Element Plus 主题映射、边框兼容规则和 `@utility` 必须保持。
- 新代码不要使用 v3 时代的 `@tailwind base/components/utilities`、`content`/`safelist` 配置、JS `addVariant`、`theme()` 运行时取值或重复媒体查询。迁移旧代码时按 [Tailwind v4 reference](references/tailwind-v4.md) 核对重命名 utility 和变体顺序。
- 主题 token 是 API：需要生成 `bg-*`、`text-*`、`border-*`、`shadow-*` 或响应式变体的变量放入 `@theme`；只供运行时读取、不生成 utility 的变量保留在 `:root` 或既有 Element Plus token 中。引用其它变量的 token 使用 `@theme inline`。
- 优先使用 v4 内建的容器查询、`starting:`、`not-*`、`in-*`、`*:`、`**:`、`motion-safe` 和 `motion-reduce` 等能力，避免用 JS 或局部 hack 重复实现。触摸设备不能依赖 `hover:` 才能完成关键操作。
- 具体 utility、变体或 minor 版本能力不确定时，先检查 `package.json` 的 Tailwind 版本和 v4 reference，再查官方 Tailwind 文档；不要凭记忆引入未确认的类名。
## 按任务阅读

| 任务                             | 参考                                          |
| -------------------------------- | --------------------------------------------- |
| 样式入口、语义颜色、响应式布局   | [布局与主题](references/details.md)           |
| Vue 状态样式、组件覆盖、交互验收 | [组件与状态](references/advanced-patterns.md) |
| Tailwind v4 CSS-first 配置、v3→v4 迁移与新 utility | [Tailwind v4 reference](references/tailwind-v4.md) |

交付时检查浅色 / 暗色、窄屏、文本较长和异步状态；样式检查不能代替浏览器交互检查。
