import { http } from "@/utils/http";
import type {
  LoginInput,
  RefreshTokenInput,
  RefreshTokenResult,
  UserResult
} from "./types";

/** 登录；调用方必须检查 code === 0 后再使用 data。 */
export const getLogin = (data: LoginInput): Promise<UserResult> => {
  return http.request<UserResult>("post", "/login", { data });
};

/** 刷新 token；沿用完整 code/message/data 业务包络。 */
export const refreshTokenApi = (
  data: RefreshTokenInput
): Promise<RefreshTokenResult> => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};
