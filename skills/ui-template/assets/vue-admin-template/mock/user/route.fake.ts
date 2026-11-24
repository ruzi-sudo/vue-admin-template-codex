import { defineFakeRoute } from "vite-plugin-fake-server/client";
import type { ApiResponse } from "@/api/types";
import type { RefreshTokenResult, UserResult } from "@/api/user/types";
import {
  createTokens,
  createUserInfo,
  demoCredentials,
  demoRefreshToken
} from "./data";

export default defineFakeRoute([
  {
    url: "/login",
    method: "post",
    response: ({ body }): UserResult | ApiResponse<null> => {
      if (
        body?.username !== demoCredentials.username ||
        body?.password !== demoCredentials.password
      ) {
        return { code: 10001, message: "用户名或密码不正确", data: null };
      }
      return { code: 0, message: "登录成功", data: createUserInfo() };
    }
  },
  {
    url: "/refresh-token",
    method: "post",
    response: ({ body }): RefreshTokenResult | ApiResponse<null> => {
      if (body?.refreshToken !== demoRefreshToken) {
        return { code: 10002, message: "登录已过期，请重新登录", data: null };
      }
      return { code: 0, message: "刷新成功", data: createTokens() };
    }
  }
]);
