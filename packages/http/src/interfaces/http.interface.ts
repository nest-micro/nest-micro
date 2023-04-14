import { AxiosRequestConfig } from 'axios'
import { FactoryProvider } from '@nestjs/common'

export interface HttpOptions {
  /**
   * 请求配置
   */
  axios?: AxiosRequestConfig
}

export interface HttpAsyncOptions {
  name?: string
  useFactory?: (...args: any[]) => Promise<HttpOptions> | HttpOptions
  inject?: FactoryProvider['inject']
  dependencies?: FactoryProvider['inject']
}
