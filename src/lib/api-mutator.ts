import type { AxiosError, AxiosRequestConfig } from "axios"
import { api } from "@/lib/api"

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return api({ ...config, ...options }).then(({ data }) => data as T)
}

export default customInstance

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
