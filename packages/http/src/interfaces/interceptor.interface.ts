import { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

export interface HttpInterceptor {
  /**
   * 请求拦截器
   * @param request 请求信息
   */
  onRequest?(request: InternalAxiosRequestConfig): InternalAxiosRequestConfig

  /**
   * 响应拦截器
   * @param response 响应信息
   */
  onResponse?(response: AxiosResponse): AxiosResponse

  /**
   * 请求错误拦截器
   * @param error 错误信息
   */
  onRequestError?(error: any): any

  /**
   * 响应错误拦截器
   * @param error 错误信息
   */
  onResponseError?(error: any): any
}
