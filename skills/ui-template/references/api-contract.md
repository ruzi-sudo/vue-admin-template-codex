# API 类型与请求实现规范

[登录与刷新请求的实现](../assets/vue-admin-template/src/api/user/route.ts)。

本规范适用于本模板的全部业务接口。新增、修改 API 时必须遵守；这是代码组织与评审约束，尚未新增专门的 lint 强制规则。

## 1. 目录结构

`model` 表示业务模块名，例如 `user`、`routes`、`orders`，不是要求所有接口放入同一个名为 model 的目录。

```text
src/api/
├── types/
│   └── index.ts          # 跨模块公共类型
├── user/
│   ├── types.ts          # 登录、刷新令牌的输入、数据与响应类型
│   └── route.ts          # 登录、刷新令牌的 HTTP 请求实现
├── routes/
│   ├── types.ts          # 动态菜单 DTO 与响应类型
│   └── route.ts          # 动态菜单的 HTTP 请求实现
└── <model>/
    ├── types.ts          # 本模块专有类型
    └── route.ts          # 本模块接口请求函数
```

`route.ts` 指 HTTP 接口实现；前端页面路由仍放在 `src/router/`，遵守静态 / 动态路由规范。

## 2. 类型归属与导入

| 文件                   | 职责                                               | 约束                                                                                |
| ---------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `api/types/index.ts`   | 已确认的跨模块公共契约，目前为 `ApiResponse<T>`    | 仅定义或导出类型，不依赖业务模块、HTTP 客户端、页面或 store                         |
| `api/<model>/types.ts` | 该模块的请求参数、请求体、响应数据、DTO 和响应别名 | 用 `import type` 引用公共类型；只导出类型，不发请求、不包含运行时代码               |
| `api/<model>/route.ts` | 请求方法、URL、参数传递和返回值                    | 从同目录 `types.ts` 导入类型；不声明 interface、type 或内联对象契约，不重新导出类型 |

- 禁止把类型定义与请求实现写在同一文件，也不再创建 `api/user.ts` 这类混合文件或用模块 `index.ts` 混合导出两者。
- 公共响应包络统一使用 `ApiResponse<T>`；模块中通过别名定义响应，如 `UserResult = ApiResponse<UserInfo>`，不能重复声明 `code/message/data`。
- 登录令牌属于 `user/types.ts`；动态菜单属于 `routes/types.ts`。被 store、页面或 Mock 引用不代表类型变成跨业务公共类型。
- 只有多个业务模块确实共享且语义一致的稳定类型才放入公共目录；分页、排序等结构必须按已确认的后端协议提取，不预设一套未使用的通用模型。
- 请求体用 `XxxInput`，查询条件用 `XxxParams`，传输实体可用 `XxxDto`，完整响应用 `XxxResult`；已有类型语义相同则复用。
- 只在类型文件定义 API 契约。UI 表单草稿、表格展示模型和组件 Props 留在页面 / 组件层，引用或投影 DTO，不复制维护另一份协议。
- 不新增 `any`、`@ts-ignore` 或未经验证的断言来绕过类型检查。`http.request<T>` 仅提供静态类型，不会校验实际 JSON。

调用方分别导入实现与类型：

```ts
import { getLogin } from "@/api/user/route";
import type { LoginInput, UserResult } from "@/api/user/types";
import type { ApiResponse } from "@/api/types";
```

公共文件不反向导入模块类型，类型文件不导入 `route.ts`，避免循环依赖。

## 3. 请求实现规范

1. 统一复用 `@/utils/http` 的 `http`。不新建 Axios 实例，不用独立 fetch，不在模块里拼 token、刷新令牌或维护会话。
2. 每个函数对应一个明确的后端操作，使用有业务含义的名称；输入引用命名类型，显式返回 `Promise<XxxResult>`，并向 `http.request<XxxResult>` 传入完整响应类型。
3. URL 使用接口相对路径，基础地址由 `VITE_API_BASE_URL` 配置。动态路径参数按路径段编码；查询参数不手工拼接 URL。
4. 请求参数按下表传递。只有后端契约要求时才增加参数、请求体或传输配置；无参接口不传空对象凑结构。
5. 直接返回完整 `{ code, message, data }` 响应，不提前解包成 `data`，不改成 `success` 协议，不捕获异常后返回伪成功或空数组。
6. 请求模块不处理页面 loading、弹窗、消息提示、导航或 store 写入。复用现有调用方的业务编排和会话机制。
7. 如需取消请求或特殊传输配置，复用现有 `PureHttpRequestConfig` 与 HTTP 层能力；业务字段类型仍放在本模块 `types.ts`，不另造请求客户端。

| 请求内容                  | HTTP 调用的第三个参数                              | 参数类型位置                      |
| ------------------------- | -------------------------------------------------- | --------------------------------- |
| GET 查询                  | `{ params }`                                       | `<model>/types.ts` 的 `XxxParams` |
| POST / PUT / PATCH 请求体 | `{ data }`                                         | `<model>/types.ts` 的 `XxxInput`  |
| DELETE                    | 按后端协议使用路径参数、`{ params }` 或 `{ data }` | `<model>/types.ts`                |
| 无参请求                  | 省略第三个参数                                     | 无需创建空类型                    |

模板中的实现示例（`src/api/user/route.ts`）：

```ts
import { http } from "@/utils/http";
import type { LoginInput, UserResult } from "./types";

export const getLogin = (data: LoginInput): Promise<UserResult> => {
  return http.request<UserResult>("post", "/login", { data });
};
```

对应的 `LoginInput`、`UserInfo` 与 `UserResult` 定义在目标项目的 `src/api/user/types.ts`，公共包络定义在 `src/api/types/index.ts`。无参 GET 示例见目标项目的 `src/api/routes/route.ts`。

## 4. 调用方与验证

- 使用数据前检查 `code === 0`。HTTP 层不会自动把非零业务码变为异常；调用方必须处理业务失败与传输异常，并在 `finally` 恢复 loading。
- 已由 store 完成业务码检查、令牌保存的登录 / 刷新流程继续复用 store，页面不重复实现。
- 筛选、重复提交和请求竞态由持有业务状态的页面、composable 或 store 处理。取消请求不应被包装成成功响应。
- Mock 与请求函数使用相同的方法、路径和响应契约；按 `mock/<model>/route.fake.ts` 与 `data.ts` 拆分，模块名与 API 对应，DTO 复用本模块 `types.ts`。Mock 仅在开发启用，具体结构与加载限制见 [Mock 规范](mock-contract.md)。
- 移动接口时同步全部导入、测试 Mock 路径和文档示例。旧文件不保留混合类型与实现的兼容出口。
- 交付前检查：类型文件没有请求代码，`route.ts` 没有类型定义，公共类型没有业务反向依赖；运行 `pnpm typecheck`、`pnpm lint`、`pnpm format:check`。
- 请求 / 鉴权相关改动运行 `pnpm test`；模块导入结构变化运行 `pnpm build`。新增行为或失败分支补充对应测试；仅移动声明不机械新增镜像测试。
