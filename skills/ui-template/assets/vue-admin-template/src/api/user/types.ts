import type { ApiResponse } from "@/api/types";

export type LoginInput = {
  username: string;
  password: string;
};

export type RefreshTokenInput = {
  refreshToken: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  /** 后端返回 ISO 8601 日期字符串，存储时转换为毫秒时间戳。 */
  expires: string;
};

export type UserInfo = AuthTokens & {
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 当前登录用户的角色 */
  roles: Array<string>;
  /** 按钮级别权限 */
  permissions: Array<string>;
};

export type UserResult = ApiResponse<UserInfo>;

export type RefreshTokenResult = ApiResponse<AuthTokens>;
