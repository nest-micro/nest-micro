import * as HttpProxy from 'http-proxy'
import { FactoryProvider } from '@nestjs/common'
import { Route } from './route.interface'

export interface ProxyOptions {
  /**
   * 路由配置
   */
  routes?: Route[]
  /**
   * HttpProxy 配置
   * @see https://github.com/http-party/node-http-proxy
   */
  extras?: HttpProxy.ServerOptions
}

export interface ProxyAsyncOptions {
  name?: string
  useFactory?: (...args: any[]) => Promise<ProxyOptions> | ProxyOptions
  inject?: FactoryProvider['inject']
  dependencies?: FactoryProvider['inject']
}
