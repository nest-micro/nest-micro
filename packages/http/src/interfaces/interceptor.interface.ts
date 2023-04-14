import { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

export interface Interceptor {
  onRequest?(request: InternalAxiosRequestConfig): InternalAxiosRequestConfig

  onResponse?(response: AxiosResponse): AxiosResponse

  onRequestError?(error: any): any

  onResponseError?(error: any): any
}
