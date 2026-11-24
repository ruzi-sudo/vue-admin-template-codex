# Mock 目录与路由结构规范

[用户模块的开发 Mock](../assets/vue-admin-template/mock/user/route.fake.ts)。

Mock 按 `src/api/<model>/` 的接口模块组织；模块名与 API 保持一致。这里的路由指 HTTP 接口，不按前端页面 URL 分组，也不把不同模块的接口堆进同一个文件。

## 1. 目录与对应关系

```text
src/api/user/route.ts       → mock/user/route.fake.ts
src/api/user/types.ts       → mock/user/data.ts 引用其类型
src/api/routes/route.ts     → mock/routes/route.fake.ts
src/api/routes/types.ts     → mock/routes/data.ts 引用其类型

mock/
├── user/
│   ├── data.ts             # 演示账号、令牌及用户数据生成函数
│   └── route.fake.ts       # POST /login、POST /refresh-token
├── routes/
│   ├── data.ts             # 动态菜单数据生成函数
│   └── route.fake.ts       # GET /get-async-routes
└── <model>/
    ├── data.ts             # 对应业务模块的模拟数据
    └── route.fake.ts       # 对应 API 模块的接口处理器
```

- `<model>` 使用与 API 相同的小写 `kebab-case` 名称，如 `user`、`orders`、`audit-log`。
- 每个模块只有一个 `route.fake.ts` 入口，由插件自动发现；不再放置根目录聚合接口文件，不创建额外的总入口重新导出处理器。
- 一个模块可以包含多个相关接口。例如 `/login` 与 `/refresh-token` 都属于 `user` 模块；`/get-async-routes` 属于 `routes` 模块。
- 新增 Mock 时同时确认对应的 `src/api/<model>/route.ts`、`types.ts` 已存在。没有开发模拟需求的 API 模块不强制创建 Mock 空壳。

## 2. 文件职责

| 文件                       | 职责                                               | 限制                                                                        |
| -------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| `<model>/route.fake.ts`    | 声明 URL、method、状态码、请求分支和响应包络       | 只注册本模块接口；通过同目录 `data.ts` 获取数据，不内联业务数据集或声明 DTO |
| `<model>/data.ts`          | 模拟实体、场景数据、数据生成函数和必要的模块内状态 | 不调用 `defineFakeRoute`，不注册接口，不调用真实 API                        |
| `<model>/types.ts`（按需） | 仅 Mock 使用的场景 / 状态类型                      | 不复制 API DTO；没有独有类型时不创建                                        |
| `shared/`（按需）          | 多个模块确实共用的模拟工具 / 类型                  | 不注册接口、不集中业务数据；单模块逻辑留在模块目录                          |

接口 DTO、请求参数和响应类型从 `@/api/<model>/types` 通过 `import type` 复用；公共包络复用 `@/api/types` 的 `ApiResponse<T>`。禁止从 API 的 `route.ts` 导入请求实现，也禁止复制一套 `code/message/data` 类型。

`route.fake.ts` 中可以写响应码和提示，但用户、订单、菜单等业务数据以及演示凭据放在 `data.ts`。返回成功数据前按已确认的协议检查输入；失败沿用真实接口的业务码和数据形状。Mock 不是可信的生产认证或授权服务。

## 3. 注册与数据约束

1. `vite.config.ts` 保持 `include: "mock"`、`infixName: "fake"`，仅发现 `*.fake.ts` 等处理器文件；项目统一使用 `route.fake.ts`。禁止改回扫描所有脚本，防止把数据和类型文件当作接口入口。
2. `data.ts`、`types.ts` 和共享工具不得使用 `.fake.ts` 后缀。`tsconfig.json` 使用 `mock/**/*.ts`，覆盖所有嵌套 Mock 文件的类型检查。
3. Mock 的 method、URL、参数位置及响应结构与对应 API 一致。一个 method + URL 只能注册一次；同 URL 的不同 method 可以分别实现。
4. 业务数据以明确的 API 类型约束。优先使用返回新对象 / 新数组的工厂函数；需要模拟写操作时将状态限定在模块内，说明初始化和重置方式，避免不同请求或测试意外共享可变数据。
5. 不为拆分目录改变已有接口协议。当前仍使用 `admin/admin123`，登录失败码 `10001`、刷新失败码 `10002`，成功码 `0`；动态菜单默认返回 `[]`。
6. 动态业务目录和模拟授权数据在 `mock/routes/data.ts` 中组合，`mock/routes/route.fake.ts` 负责 HTTP 入口。按路由规范接入账号授权，不让浏览器直接导入全量 Mock 数据作为菜单。
7. Mock 仅用于开发。保留 `VITE_USE_MOCK`、非 preview 条件和 `enableProd: false`；生产构建与预览不提供模拟接口。

## 4. 示例

模块数据文件 `mock/routes/data.ts`：

```ts
import type { DynamicRouteDto } from "@/api/routes/types";

export const createAsyncRoutes = (): DynamicRouteDto[] => [];
```

对应的处理器 `mock/routes/route.fake.ts`：

```ts
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import type { AsyncRoutesResult } from "@/api/routes/types";
import { createAsyncRoutes } from "./data";

export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: (): AsyncRoutesResult => ({
      code: 0,
      message: "操作成功",
      data: createAsyncRoutes(),
    }),
  },
]);
```

## 5. 验收

- `tests/mock-structure.test.ts` 自动检查处理器目录 / 命名、对应 API 模块及数据文件是否存在、method + URL 是否重复。跨模块接口归属、类型复用和数据职责仍需按本规范评审。
- 移动处理器时删除旧注册，更新文档路径；不得靠保留旧文件转发维持重复入口。
- 运行 `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm format:check`。修改插件发现规则或 TypeScript 配置时运行 `pnpm build`。
- 实际请求受影响的开发接口，覆盖成功、错误输入和空结果；确认子目录处理器可访问、数据文件未被注册。生产构建成功不能替代开发接口验证。
