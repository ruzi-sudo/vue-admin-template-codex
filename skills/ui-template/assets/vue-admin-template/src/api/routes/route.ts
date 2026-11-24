import { http } from "@/utils/http";
import type { AsyncRoutesResult } from "./types";

/** 获取当前会话获准的动态菜单；空数组表示没有动态业务菜单。 */
export const getAsyncRoutes = (): Promise<AsyncRoutesResult> => {
  return http.request<AsyncRoutesResult>("get", "/get-async-routes");
};
