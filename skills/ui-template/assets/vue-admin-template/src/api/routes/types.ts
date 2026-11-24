import type { ApiResponse } from "@/api/types";

/** 后端可序列化的动态路由；与映射组件后的运行时路由分开。 */
export interface DynamicRouteDto {
  name: string;
  path: string;
  redirect?: string;
  component?: string;
  meta: {
    title: string;
    rank?: number;
    roles?: string[];
    auths?: string[];
    showLink?: boolean;
    activePath?: string;
    keepAlive?: boolean;
    icon?: string;
  };
  children?: DynamicRouteDto[];
}

export type AsyncRoutesResult = ApiResponse<DynamicRouteDto[]>;
