# Admin Starter

这是一个可独立复制的 Vue 3 后台起步模板。它保留登录、布局、主题、多标签页、中英文、动态路由权限和基础表格/弹窗/抽屉能力；演示业务和重型演示依赖已移除。

## Skill 驱动开发

使用 Vue Admin Template 插件中的 `ui-template` skill 获取项目规则。在新项目根目录保留模板的配置文件、源码、测试、锁文件和 `LICENSE`。已有项目按需对照对应模块。

## 独立使用

环境要求：Node.js `>=22.22.1`，pnpm `>=11`。安装依赖并启动开发服务器：

```bash
pnpm install --frozen-lockfile
pnpm dev
```

默认开发端口为 `4175`，以终端输出为准。开发 Mock 账号是 `admin` / `admin123`，仅用于本地演示。生产必须连接真实后端；`pnpm preview` 不提供 Mock 登录服务。

## 常用命令

| 命令                | 用途                                            |
| ------------------- | ----------------------------------------------- |
| `pnpm dev`          | 启动开发服务器并按开发配置加载 Mock             |
| `pnpm typecheck`    | 执行 `vue-tsc` 类型检查                         |
| `pnpm lint`         | 检查 `src`、`mock`、`tests` 与 Vite/Vitest 配置 |
| `pnpm format:check` | 检查 Prettier 格式                              |
| `pnpm format`       | 格式化工作区文件                                |
| `pnpm test`         | 运行 Vitest Node 行为测试                       |
| `pnpm build`        | 类型检查并构建生产产物                          |
| `pnpm preview`      | 预览已构建产物                                  |

## 目录入口

- `src/views/`：业务页面。
- `src/api/`：按模块拆分的 API 类型和请求实现。
- `src/router/modules/`：应用壳静态路由。
- `mock/routes/data.ts`：动态菜单的开发数据源，初始为空数组。
- `mock/`：与 API 模块对应的开发 Mock。

环境变量、真实后端切换、接口契约和页面结构不要在 README 另行维护，直接以 `ui-template` skill 和当前源码为准。
