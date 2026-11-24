# 模板开发引导与从零重构

这份 reference 的主任务是：在没有现成模板结构的情况下，从空目录或不符合本规范的代码库开始，逐步建立并验证本模板规定的 Vue 管理后台架构。已有本模板项目上的增量开发是常规场景；把其他标准开发的项目迁移到本模板并完成 A 到 B 的渐进式重构是次要模式，但必须有清晰的边界、阶段、兼容和回滚策略。

能力优先级如下：

1. **从零建立目标架构（主路径）**：从空目录、半成品或不符合目标约束的代码开始，先建立目标态，再实现业务。
2. **已有项目迁移（次路径）**：先建立目标态和迁移边界，再将旧项目的行为、数据和业务能力分片迁移到目标架构。
3. **目标架构上的增量开发（常规维护）**：在已经符合本模板规则的项目中，按层完成日常变更。

本指南负责回答“先建什么、放在哪里、如何连接起来，以及如何把旧项目迁移到这里”；详细约束仍以 [项目规则](project-rules.md)、[页面结构](page-component-structure.md)、[路由来源](route-sources.md) 和 [路由与 RBAC](routing-rbac.md) 为准。若源码与文档冲突，以实际源码和 `package.json` 为准。

## 0.1 先建立目标态，再迁移内容

无论源项目是空目录、已有本模板项目，还是按照其他 Vue/前端标准开发的项目，都先把“目标态”当作唯一验收标准：

- **目标态**：目录契约、入口链路、路由与布局、HTTP 与会话、权限、i18n、Mock、样式和验证方式都符合本 reference。
- **源态**：空目录、旧模板、其他框架或其他状态管理/请求规范，只提供需要迁移的资产，不决定目标边界。
- 旧目录、旧接口、旧状态管理或旧权限模型与目标态冲突时，先登记差异，再通过适配层或分阶段迁移解决；不要把两套规则长期混在页面里。
- 重构不是机械重命名。先拆分责任和数据流，再迁移可观察行为，最后删除旧入口、旧适配和重复实现。
- 如果源项目不是 Vue，先建立本模板的 Vue 入口、路由、布局、API 和状态边界，再迁移领域行为与数据契约，不直接复制源框架的组件结构。

主路径从下一节开始：先建立最小目标骨架，再逐步补齐运行时能力和业务页面。迁移项目时也先完成这一步，迁移细节见第 9 节。

## 0. 目标技术栈

从零搭建时保持以下组合，除非任务明确要求迁移：

- Node.js `>=22.22.1`、pnpm `>=11`、Vue 3、TypeScript、Vite、Vue Router、Pinia。
- Element Plus 作为基础组件库；Tailwind CSS v4 负责布局、间距、响应式和主题 token。
- Axios 作为请求实现；Vue I18n 负责中英文文案；Vitest、Vue Test Utils 或现有测试工具负责行为验证。
- 业务路由、API、Mock、权限和会话都使用本模板规定的边界，不在页面中自行创建第二套机制。

## 1. 从空目录初始化

### 1.1 创建应用和包管理配置

先盘点目标根目录，包括隐藏目录。只允许按需新增 `docs/`、`scripts/`、`tmp/`。空项目若缺少 `src/` 等必要目录，先说明缺少的路径，暂停依赖这些路径的搭建步骤。安装依赖前也要确认命令可以复用现有目录。

确认 `package.json` 使用 ESM、声明 Node/pnpm 引擎，并补齐以下脚本：

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite --port 4175",
    "build": "vue-tsc --noEmit --skipLibCheck && vite build",
    "preview": "vite preview --port 4175",
    "typecheck": "vue-tsc --noEmit --skipLibCheck",
    "lint": "eslint src mock tests vite.config.ts vitest.config.ts --max-warnings 0",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

核心依赖至少包括：

```bash
pnpm add vue vue-router pinia axios element-plus @vueuse/core vue-i18n
pnpm add -D typescript vite vue-tsc @vitejs/plugin-vue tailwindcss @tailwindcss/vite eslint prettier vitest
```

要复刻本模板的现有能力，再按实际需求加入 `@pureadmin/table`、`@pureadmin/utils`、`@iconify/vue`、`vue-tippy`、`vite-plugin-fake-server`、`sass` 和图标包。不要为了空目录初始化一次性加入无关 UI 框架。

### 1.2 先建立目录骨架

下图用于定位已有项目中的文件。只在已有一级目录下按需补齐对应结构，迁移阶段也遵循第 1.1 节的根目录白名单。

```text
.
├─ public/
├─ src/
│  ├─ api/
│  │  ├─ types/index.ts
│  │  └─ <model>/{route.ts,types.ts}
│  ├─ assets/
│  ├─ components/
│  ├─ config/
│  ├─ directives/
│  ├─ layout/
│  ├─ plugins/
│  ├─ router/
│  │  ├─ modules/
│  │  ├─ dynamic/
│  │  ├─ index.ts
│  │  └─ types.ts
│  ├─ store/
│  │  ├─ index.ts
│  │  └─ modules/
│  ├─ style/
│  │  ├─ reset.scss
│  │  ├─ index.scss
│  │  └─ tailwind.css
│  ├─ utils/
│  ├─ views/
│  │  ├─ login/
│  │  ├─ home/
│  │  └─ error/
│  ├─ App.vue
│  └─ main.ts
├─ locales/
│  ├─ zh-CN.yaml
│  └─ en.yaml
├─ mock/
│  └─ <model>/{route.fake.ts,data.ts}
├─ tests/
├─ types/
├─ index.html
├─ vite.config.ts
├─ vitest.config.ts
├─ tsconfig.json
├─ eslint.config.ts
├─ .prettierrc.ts
├─ package.json
└─ pnpm-lock.yaml
```

目录名是架构契约：页面、API、Mock 和路由按业务归属组织；不要先把所有页面、请求或 handler 聚合到单个大文件。

## 2. 根配置的最小契约

空目录中必须先完成根配置，再开始写业务页面。

| 文件               | 必须承担的职责                                                      | 完成条件                                            |
| ------------------ | ------------------------------------------------------------------- | --------------------------------------------------- |
| `vite.config.ts`   | Vue、Vue JSX（若使用）、Tailwind v4、路径别名、开发代理和 Mock 插件 | `@/` 指向 `src`；开发 `/api` 代理和 Mock 开关可配置 |
| `tsconfig.json`    | `src`、`mock`、`tests`、根类型声明的类型范围和路径别名              | `vue-tsc --noEmit` 能发现源码错误                   |
| `eslint.config.ts` | Vue、TypeScript、Tailwind 和格式规则                                | lint 覆盖 `src`、`mock`、`tests` 和配置文件         |
| `.prettierrc.ts`   | 项目统一格式                                                        | `pnpm format:check` 可执行                          |
| `vitest.config.ts` | 测试环境、别名、setup 文件                                          | 测试可以导入 `@/` 并运行 Node/DOM 约定              |
| `.env.development` | `VITE_API_BASE_URL`、`VITE_PUBLIC_PATH`、`VITE_USE_MOCK`、代理目标  | 开发配置可切换真实 API 与 Mock                      |
| `.env.production`  | 生产 API 和公共路径                                                 | 不启用开发 Mock，不存放密钥                         |

`vite.config.ts` 至少配置 `@vitejs/plugin-vue`、`@tailwindcss/vite` 和 `resolve.alias`。API 代理只负责开发服务器转发，默认保留 `/api` 前缀；不要把服务端密钥放入 `VITE_` 变量。

## 3. 应用启动链路

### 3.1 `src/main.ts`

启动文件按以下顺序组织：

1. `createApp(App)`。
2. 导入 reset、公共样式、Tailwind 和 Element Plus 样式；保留项目现有顺序。
3. 初始化本地化、store、路由和运行时配置。
4. 注册 `Auth`、`Perms`、图标和全局指令。
5. 注册 Element Plus、表格、tooltip 等公共插件。
6. 等待路由准备完成后 `app.mount('#app')`。

不要在页面组件中重复注册全局插件，也不要在 `main.ts` 中写业务请求。

### 3.2 `src/App.vue`

根组件只负责应用级壳层：

- 通过 `el-config-provider` 注入 Element Plus locale。
- 渲染 `<router-view />`。
- 挂载全局 dialog/drawer 容器。
- 处理路由切换时关闭浮层、全局水印等应用级副作用。

页面内容、查询请求和业务表单不放在 `App.vue`。

### 3.3 插件和组件注册

创建 `src/plugins/elementPlus.ts`，集中注册后台框架和高频基础组件，例如 `ElButton`、`ElForm`、`ElTable`、`ElPagination`、`ElDialog`、`ElDrawer`、`ElMessage` 和 `ElLoading`。新增组件前先检查是否已注册；低频业务组件优先在使用处显式导入。

## 4. 路由和布局的搭建顺序

### 4.1 先建静态入口

先创建并验证以下静态页面和路由：

- 登录页：`/login`。
- 根布局：`/`，承载侧栏、顶部栏、标签页和内容区域。
- 首页：根布局下的默认子路由。
- 刷新、重定向、403、404 和 500 页面。

静态路由放 `src/router/modules/`，使用懒加载，路由 `name` 与页面 `defineOptions({ name })` 保持一致。业务菜单和隐藏详情页默认走动态路由。

### 4.2 建立布局最小闭环

`src/layout/` 至少提供：

- 主布局容器和 `<router-view />`。
- 菜单树及侧栏折叠。
- 顶部操作区和面包屑。
- 多标签页或页面缓存入口（如果项目启用 KeepAlive）。
- 内容区域的滚动和响应式宽度。

布局从路由和权限 store 读取菜单，不从每个业务页面复制导航逻辑。移动端、暗色和窄屏行为要在布局闭环后再添加业务页面。

### 4.3 再接动态路由

创建 `src/router/dynamic/` 作为开发时的领域路由定义和 Mock/种子入口；浏览器实际使用后端返回的动态菜单。路由守卫负责：

1. 白名单放行登录和刷新 token。
2. 检查会话，必要时刷新 token。
3. 加载用户、角色、按钮权限和菜单。
4. 注册动态路由并补充 404。
5. 登出或账号切换时清理缓存、权限和动态路由。

详细的静态/动态归属和权限来源分别见 [路由来源](route-sources.md) 与 [路由与 RBAC](routing-rbac.md)。

## 5. API、会话和 Mock 的最小闭环

### 5.1 HTTP 层

先创建 `src/api/types/index.ts` 和 `src/utils/http/`：

```ts
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

HTTP 层负责 base URL、超时、请求头、token 注入、刷新 token、并发请求排队和登出清理。页面不创建 Axios 实例、不手工拼 token、不直接调用 `fetch`。

鉴权白名单至少包含 `/login` 和 `/refresh-token`。刷新失败时必须结束所有等待请求并清理会话；修改这部分行为时补充回归测试。

### 5.2 业务 API

每个业务模块拆成：

```text
src/api/user/types.ts   # DTO、请求参数、响应别名
src/api/user/route.ts   # 仅封装 http 请求函数
```

`types.ts` 只导出类型；`route.ts` 只实现请求。GET 查询使用 `params`，POST/PUT/PATCH 使用 `data`，显式返回 `Promise<XxxResult>`。普通调用必须处理非零 `code`、传输异常和 loading 恢复。

### 5.3 Mock

Mock 目录必须与 API 模块一一对应：

```text
mock/user/route.fake.ts  # 只注册 user 模块接口
mock/user/data.ts        # 数据和生成函数
```

Mock 使用 `include: "mock"`、`infixName: "fake"`，一个 method + URL 只注册一次。Mock 只在开发启用；构建和预览不能默认带入 Mock。

## 6. Store、权限和 i18n

### 6.1 Store

先创建 `src/store/index.ts`，再按职责拆分 `src/store/modules/`：

- `user`：会话、用户资料、角色和按钮权限。
- `permission`：菜单、动态路由和路由注册状态。
- `app` 或配置 store：主题、设备、侧栏和布局配置。
- `multiTags` 或缓存 store：标签页和 KeepAlive 状态（项目需要时）。

每个状态只保留一个权威来源。刷新、登出和账号切换必须同步清理会话、动态路由、缓存和本地存储。

### 6.2 权限

- `meta.roles`：页面和菜单层级控制。
- `meta.auths` + `Auth` / `v-auth` / `hasAuth`：当前路由声明的页面权限。
- `permissions` + `Perms` / `v-perms` / `hasPerms`：登录数据中的按钮权限。

不要混用两套按钮权限来源。前端隐藏不能代替后端接口授权；数组权限按项目既有约定判断是否要求全部满足。

### 6.3 国际化

创建 `locales/zh-CN.yaml`、`locales/en.yaml` 和 `src/plugins/i18n/`。所有用户可见文案同步维护两种语言，页面只调用已有 i18n 工具，不自行维护语言状态。Element Plus locale 与业务 locale 必须跟随同一当前语言。

## 7. 样式系统和组件实现

创建 `src/style/tailwind.css`，保持 Tailwind v4 CSS-first 入口：使用显式的 `theme.css` 和 `utilities.css` 导入，不新增旧版 `@tailwind base/components/utilities` 或 `tailwind.config.ts`。项目 token 使用 `@theme`，scoped Vue 样式需要 `@apply` 时使用 `@reference`；运行时变量放在 `:root` 或既有 Element Plus token 中。

组件实现顺序：

1. 先读 Element Plus 设计概览和相邻组件。
2. 判断现有 Element Plus 组件或项目包装是否可以直接复用。
3. 明确 props、emits、slots、状态归属和错误处理。
4. 再用 Tailwind 组织布局、间距、响应式和暗色样式。
5. 最后检查键盘、窄屏、长文本、loading、空态、错误态和重复提交。

页面不重复实现应用外壳。表格消费 `PureTableBar` 的 `size` 与 `dynamicColumns`；弹窗、抽屉分别使用 `addDialog`、`addDrawer`，保存失败时保留输入。

## 8. 第一个业务页面的落地顺序

在基础闭环完成后，用一个真实业务页面验证架构：

1. 在 `src/views/<业务>/` 创建页面和页面私有组件。
2. 在 `src/api/<model>/` 创建 `types.ts` 和 `route.ts`。
3. 按需在 `mock/<model>/` 创建数据和 `route.fake.ts`。
4. 在 `src/router/dynamic/` 或后端菜单种子中加入路由元数据。
5. 在两种 locale 文件补充文案。
6. 页面只拥有页面状态和调用编排；请求细节留在 API 模块；跨页面状态留在 store。
7. 验证允许/拒绝权限、刷新、登出、空数据、失败重试和窄屏布局。

## 9. 次要模式：从其他标准迁移到本模板

这不是首要搭建路径。先按第 1-8 节建立或确认目标架构，再将旧项目内容按层迁移；不要让旧项目的目录、状态管理、请求契约或权限模型反向定义模板规范。

### 9.1 阶段 A：盘点源项目和差异

先建立一份迁移清单，至少记录：

- 技术栈、包管理器、构建入口、环境变量和部署方式。
- 应用入口、全局插件、布局、静态路由、动态路由和 404/错误处理。
- HTTP 客户端、响应契约、token/refresh、登出和错误恢复。
- 状态管理、权限来源、菜单生成、持久化和缓存策略。
- i18n、主题、组件库、样式入口、Mock、测试和 CI 检查。
- 旧模块与目标目录的映射，以及每个模块的兼容风险、负责人和回滚点。

先产出“源态 -> 目标态”的差异表，再决定迁移顺序。不要在没有差异表的情况下批量移动目录或重写入口。

### 9.2 阶段 B：先建立目标骨架

即使旧项目已经可以运行，也要先建立本模板的目标入口和边界：

1. 建立目标根配置、目录骨架、`main.ts`、`App.vue`、样式入口和插件注册。
2. 建立路由模块、布局壳、登录页、错误页和最小导航闭环。
3. 建立 `src/api/<model>/types.ts` 与 `route.ts`、HTTP/session 层和统一响应契约。
4. 建立 Pinia store 边界、权限模型、i18n、Mock 和测试入口。
5. 用一个最小业务切片验证目标链路，确认 typecheck、lint、test 和 build 可运行。

骨架建立完成前，不把旧业务页面大量复制到新目录；否则会把源项目的耦合关系带入目标架构。

### 9.3 阶段 C：建立临时适配边界

在旧能力还没有完成迁移时，可以添加明确命名的适配层来维持运行：

- 旧 API 通过目标 `src/api/` 或 adapter 转换为 `{ code, message, data }`，页面不直接调用旧客户端。
- 旧 store/状态容器通过目标 store 或 composable 暴露，页面不同时订阅两套状态源。
- 旧路由、菜单和权限映射到目标 `meta.roles`、`meta.auths`、`permissions`，不在页面里散落判断。
- 旧组件库可以暂时封装，但新页面优先使用 Element Plus 语义和本模板的 Tailwind v4 规则。
- 适配层必须登记拥有者、删除条件和预计移除阶段；禁止把临时桥接当成永久架构。

### 9.4 阶段 D：按业务切片迁移

每次选择一个完整业务域或用户流程，按以下顺序迁移：

1. 页面与页面私有组件。
2. API 类型和请求实现。
3. 跨页面状态与权限。
4. 静态/动态路由和菜单元数据。
5. Mock 数据、错误分支和本地化文案。
6. 单元、组件或 E2E 测试，以及该切片的 typecheck、lint、format 和 build。

每个切片都要保留可观察行为的等价性：成功、加载、空态、失败、重试、权限拒绝、刷新和登出都不能因为迁移而静默消失。迁移过程中不要为满足目录示例批量重命名无关文件；保留兼容路径，等调用方迁移完成后再清理。

### 9.5 阶段 E：切换和收尾

当所有关键切片完成后：

1. 将入口、路由和菜单切换到目标实现。
2. 运行完整 typecheck、lint、format、test、build 和真实导航检查。
3. 确认没有旧入口、旧请求客户端、重复状态源或未注册的 Mock handler。
4. 删除已满足移除条件的适配层和兼容路径，更新迁移记录和文档。
5. 保留一个可回滚提交或发布点，直到目标实现通过回归和部署验证。

### 9.6 迁移不变量

- 任何时刻只有一个页面入口、一个会话来源、一个权限真相源和一个业务 API 归属。
- 迁移顺序以依赖和用户流程为单位，而不是以文件数量为单位。
- 每个阶段都可独立验证、可定位失败、可回滚；不要一次性重排整个仓库。
- 文档中的模板约束只有在对应运行时能力已建立后才生效，不用空文档替代实现。
- 前端兼容适配不等于后端授权；服务端仍必须执行真实权限和数据校验。

## 10. 主路径完成标准：从零建立目标态

只有满足以下条件，才可以认为模板骨架搭建完成：

- `pnpm dev` 能启动并打开登录页，`pnpm build` 能生成产物。
- 根布局、首页、登录、错误页、路由守卫和 404 闭环可用。
- 至少一个业务 API 可通过真实 HTTP 或开发 Mock 完成查询与错误处理。
- token 注入、刷新失败、登出清理和权限拒绝行为有明确实现与测试。
- 中英文 locale、Element Plus locale、浅色/暗色、窄屏和键盘操作已验证。
- `pnpm typecheck`、`pnpm lint`、`pnpm format:check` 以及适用的 `pnpm test` 运行结果已记录。

## 11. 次路径完成标准：迁移到目标态

已有项目只有同时满足以下条件，才可以认为迁移完成，而不是“新目录已经出现”：

- 源态与目标态的差异清单已关闭，或每个未关闭项都有明确理由、负责人和后续阶段。
- 目标入口、路由、布局、API/session、store、权限、i18n、Mock、样式和测试边界已成为运行时的唯一主路径。
- 至少一个完整业务切片已完成行为等价验证，包含成功、加载、空态、失败、重试、权限、刷新和登出场景。
- 旧入口、旧客户端、旧状态源和临时适配层已删除，或明确记录仍保留的兼容期限和删除条件。
- `pnpm typecheck`、`pnpm lint`、`pnpm format:check`、适用的 `pnpm test` 和 `pnpm build` 已在目标项目中运行并记录。
- 至少保留一个回滚点，并完成真实浏览器、后端契约或部署环境中仍未验证项目的说明。

交付时必须列出实际创建/修改的文件、实际执行的命令和结果，并明确未验证的浏览器、后端或部署行为。不要仅凭代码阅读、类型检查或启动进程声称完整流程已经通过。
