# 项目结构与开发规则

这是 `skills/ui-template/SKILL.md` 的详细规范。它是本模板的唯一项目级开发规则；根目录 Agent 文件、README 和源码内说明只负责入口或补充当前事实，不复制另一套约束。

## 1. 项目边界与工具链

- 这是可独立搭建或复制的单应用 Vue 后台模板。目标项目应保留自己的配置文件、锁文件和 LICENSE；本插件已经内置全部 skills，不依赖父项目、外部 skill 目录、父级 node_modules 或机器专属缓存路径。
- 保持现有 Vue 3、TypeScript、Pinia、Vue Router、Element Plus、Tailwind CSS 4、Vite 8/Rolldown、ESLint、Prettier、vue-tsc 和 Vitest 组合。只有具体需求证明必要时才增加依赖，不恢复完整演示业务或重型插件。
- 使用 `package.json` 的 `packageManager`、scripts 和配置作为命令事实。保留并同步 `pnpm-lock.yaml`，不要混用 npm 或 Yarn 锁文件。
- 不提交 `node_modules`、`dist`、覆盖率、缓存或本机环境文件。共享技能的来源和许可证必须保留。
- `pnpm dev` 用于开发，端口以进程输出为准；`pnpm build` 构建；`pnpm preview` 只预览已构建产物。生产构建和预览不启用 Mock。

新增、修改或建议的代码必须使用 TypeScript，文档示例也遵循此规则。模块、测试、Mock 和脚本配置用 `.ts`，JSX 用 `.tsx`，Vue 脚本显式声明 `lang="ts"` 或 `lang="tsx"`。修改已有 JavaScript 逻辑时，在本次改动中迁移涉及的文件或脚本块，并更新相关引用。

## 2. 目录职责

从空目录起步时先复制[内置模板](../assets/vue-admin-template/README.md)的完整目录结构。完成初始化后，目标项目根目录只允许按需新建 `docs/`（文档）、`scripts/`（脚本）和 `tmp/`（临时文件）。已有一级目录可以继续按原职责使用，例如已有 `src/` 时可以创建 `src/views/` 下的页面。下文提及的其他一级目录均以已存在为前提。执行生成、安装或构建命令前也要检查其输出路径，规则同样适用于隐藏目录和被 Git 忽略的目录。

```text
src/
├── api/
│   ├── types/index.ts       # 跨模块公共 API 类型
│   └── <model>/             # 每个业务模块一个目录
│       ├── types.ts         # 请求、DTO、响应类型
│       └── route.ts          # HTTP 请求实现
├── assets/                  # 被源码引用的资源
├── components/              # 跨页面复用组件和现有基础封装
├── composables/             # 跨领域复用组合式函数
├── config/                  # 平台和运行配置
├── directives/              # 全局指令
├── layout/                  # 既有应用外壳、导航、标签和内容容器
├── router/
│   ├── modules/             # 首页、登录、错误、刷新等静态壳路由
│   └── dynamic/             # 首次新增业务时建立的动态定义和汇总入口，供 Mock/种子使用
├── store/                   # Pinia 状态
├── utils/                   # 不依赖业务页面的工具和 HTTP/会话基础设施
└── views/<domain>/          # 业务页面及页面私有组件/composables
mock/<model>/
├── route.fake.ts            # 只注册该模块的 fake 接口
├── data.ts                  # 数据和工厂函数
└── types.ts                 # 仅 Mock 专有类型
tests/                       # Node 环境行为测试；UI 仍需实际页面验收
types/                       # 全局声明，不放业务 API DTO
locales/                     # 中英文 locale 源文件
public/                      # 运行时公开资源
```

目录规则：

- 新页面使用 `src/views/<domain>/index.vue`；页面私有组件和逻辑就近放置，至少有两个真实页面复用后再提升到 `src/components` 或 `src/composables`。
- 业务目录使用小写 `kebab-case`；通用组件延续现有 PascalCase 目录和出口。既有路径按改动范围兼容，不批量重命名无关代码。
- 不让公共工具或通用组件反向依赖 `views/`；页面之间不直接 import 另一个路由页，共享内容提取到同领域组件。
- `@/` 指向 `src`。页面文件名、路由 `name` 和 `defineOptions({ name })` 保持一致，尤其是使用 KeepAlive 的页面。
- 路由组件使用懒加载。复用 `src/layout` 的外壳，不在业务页面重复创建导航、侧栏、标签页、内容容器或全局插件。

## 3. Vue、TypeScript 与组件契约

- Vue SFC 优先使用 `<script setup lang="ts">`，显式导入实际使用的 Vue API；不要假设存在自动导入。TSX 使用 Vue 的响应式和模板语法，不引入 React 写法。
- 请求、响应、表单、表格行、Props、Emits、Slots、事件和异步结果都要有明确类型。新增代码不使用 `any`、`@ts-ignore` 或关闭规则来掩盖契约问题；遗留宽类型按改动范围逐步收紧。
- 页面负责组合状态、请求和区域；展示组件优先受控，只发出用户意图。请求、导航、Toast、权限 store 和页面级 loading 不藏在无语义的通用组件中。
- 页面根节点承接布局属性；操作使用按钮，导航使用链接；避免嵌套表单、重复提交、重复标题职责和只有一层无语义容器的组件拆分。
- 新增或改造页面、组件前读取 [page-component-structure.md](page-component-structure.md)，按其契约、SFC 顺序、语义化 HTML 和验收表实现。

## 4. 页面、UI 与设计系统

- 新增或改造任何自定义组件，包括从零实现、二次封装和业务组合，先读 [Element Plus design overview](../../element-plus-skills/element-plus-design-overview/SKILL.md)，再读最接近的 `el-*` 组件及涉及的颜色、边框、布局、排版和暗色技能。
- 先复用已注册的 Element Plus 组件、`PureTableBar`/`pure-table`、`ReDialog`、`ReDrawer`、`Auth` 和 `Perms`。使用未注册组件前检查 `src/plugins/elementPlus.ts`。
- 颜色使用 Element Plus 变量或现有 Tailwind 主题 token；兼顾 `.dark` 模式，避免业务页硬编码白色背景、独立配色体系或全局 `!important`。Tailwind 负责布局和局部样式，不能替代组件语义和主题依据。
- 表单要有可识别标签、验证提示、键盘提交、提交 loading、空数据、失败和重复提交处理。可见文案补齐 `locales/zh-CN.yaml` 与 `locales/en.yaml`，复用现有 i18n 工具。
- `PureTableBar` 默认插槽消费 `size` 与 `dynamicColumns`；刷新事件重新请求；分页使用 `page-size-change` 和 `page-current-change`。筛选或页大小改变时重置页码。
- 使用 `addDialog`/`addDrawer` 打开弹层。`beforeSure(done, { closeLoading })` 先校验再保存；成功才调用 `done()`，失败调用 `closeLoading()` 并保留输入。
- 保持 `src/main.ts` 的样式入口顺序。Tailwind 4 入口当前分别引入 theme 和 utilities，不改成带完整 Preflight 的入口。

## 5. 路由与权限

- 首页、登录、错误、刷新等应用壳路由放 `src/router/modules/` 并遵循 `RouteConfigsTable`。业务页、详情页和隐藏页默认动态。
- 新增业务时在 `src/router/dynamic/` 按领域定义并汇总动态路由，供 Mock 和后端种子使用；浏览器通过现有动态接口加载，不能为了预览页面把业务直接塞进静态 glob。
- 新增页面先读 [route-sources.md](route-sources.md)，列出来源、是否入库、账号状态、角色、按钮权限、隐藏详情和后端入库清单；再读 [routing-rbac.md](routing-rbac.md)。没有真实后端时仍保留动态加载链路。
- `meta.roles` 管页面和菜单；受限叶子页显式声明角色，不能假定父目录授权会自动继承。`Auth`/`v-auth`/`hasAuth` 只检查当前路由 `meta.auths`；`Perms`/`v-perms`/`hasPerms` 只检查登录数据 `permissions`。
- 角色数组和按钮权限数组的匹配语义以现有实现为准；不要混用两套权限来源。权限指令挂载时移除不允许元素，动态变化使用组件或函数控制渲染。隐藏菜单不等于 URL 或接口鉴权，后端必须再次授权。
- 保留路由守卫、动态路由初始化、刷新重匹配、标签缓存和登出清理行为。账号切换优先通过已有 `logOut()` 后重新登录；涉及热切换时必须验证旧路由、菜单、缓存和请求竞态。

## 6. API、会话与环境配置

- API 模块严格拆分为 `src/api/<model>/types.ts` 和 `route.ts`；跨模块公共类型只放 `src/api/types/index.ts`，全局声明放根 `types/`。`types.ts` 只导出类型，不发请求；`route.ts` 只实现请求，不声明或重新导出类型。
- 请求统一从 `@/utils/http` 使用现有会话层。页面不创建 Axios 实例、不直接 `fetch`、不手工拼 token；请求模块不管理页面 loading、提示、导航或 store。
- GET 查询用 `params`，POST/PUT/PATCH 请求体用 `data`；函数有命名输入类型和显式 `Promise<XxxResult>` 返回值。直接处理完整 `{ code, message, data }`，成功码为 `0`，不要按 AxiosResponse 再取一层 `data`，不要改成 `success: true`。
- 业务调用显式处理非零 `code` 和传输异常，在 `finally` 恢复 loading。`/login` 与 `/refresh-token` 保持鉴权白名单；修改拦截器时保留并发过期请求共用一次刷新、刷新失败释放所有等待请求、登出清理会话的行为，并补充行为测试。
- `VITE_API_BASE_URL` 控制 API 基础地址，`VITE_PUBLIC_PATH` 控制资源基础路径，`API_PROXY_TARGET` 只控制开发服务器 `/api` 代理且默认保留 `/api` 前缀。任何 `VITE_` 变量都会进入前端，不能放密码、私钥或服务端密钥。
- 会话统一复用 `src/utils/auth.ts`。修改存储命名空间时同步检查平台配置、会话键、路由缓存、登录和退出逻辑，避免同域应用互相污染。

## 7. Mock

- `mock/<model>/` 与 `src/api/<model>/` 一一对应。`route.fake.ts` 只注册该模块接口，`data.ts` 保存数据和生成函数，API DTO 用 `import type` 复用；仅 Mock 专有类型才放模块内 `types.ts`。
- 保持 Mock 加载器的 `include: "mock"`、`infixName: "fake"` 和现有开发条件。数据、类型和工具文件不使用 `.fake.ts` 后缀；`tsconfig.json` 覆盖 `mock/**/*.ts`。
- 一个 method + URL 只注册一次；移动处理器时删除旧入口。Mock 返回真实 API 的 method、参数位置、业务码和响应形状，不能通过浏览器直接导入全量数据作为菜单。
- `VITE_USE_MOCK=true` 仅用于开发；构建和 preview 不启用 Mock。`admin/admin123` 只代表本地演示凭据，不是生产认证或授权。

## 8. 验证与交付

- 常规代码改动运行 `pnpm typecheck`、`pnpm lint`、`pnpm format:check`；需要修正格式时运行 `pnpm format`，再复查 diff。
- HTTP、鉴权、Mock 或已有测试覆盖的行为变化运行 `pnpm test`，为新增失败分支补充有意义的行为测试。Vitest 当前是 Node 环境，不代表 UI 已通过。
- 路由、依赖、构建入口、Vite 插件或 TypeScript 配置变化运行 `pnpm build`。页面变化实际检查登录、相关导航、浅色/暗色、窄屏、加载/空/错误和键盘状态；权限变化覆盖允许和拒绝场景。
- 交付说明必须列出实际变更、实际运行的命令及结果、未验证项和需要真实后端确认的部分。不能只凭代码阅读、启动进程或成功构建宣称页面和权限流程通过。
