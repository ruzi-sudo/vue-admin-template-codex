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
      data: createAsyncRoutes()
    })
  }
]);
