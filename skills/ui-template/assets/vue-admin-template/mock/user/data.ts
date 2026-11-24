import type { AuthTokens, LoginInput, UserInfo } from "@/api/user/types";

// 仅供本地开发演示，生产环境必须由真实后端校验身份和权限。
export const demoCredentials: LoginInput = {
  username: "admin",
  password: "admin123"
};

export const demoRefreshToken = "demo-admin-refresh-token";

export const createTokens = (): AuthTokens => ({
  accessToken: "demo-admin-access-token",
  refreshToken: demoRefreshToken,
  expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
});

export const createUserInfo = (): UserInfo => ({
  avatar: "",
  username: demoCredentials.username,
  nickname: "管理员",
  roles: ["admin"],
  permissions: ["*:*:*"],
  ...createTokens()
});
