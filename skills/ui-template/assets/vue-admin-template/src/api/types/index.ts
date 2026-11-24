/** 所有业务接口共用的响应包络；code === 0 表示成功。 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
