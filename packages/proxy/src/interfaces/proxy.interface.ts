import * as HttpProxy from 'http-proxy'
import { FactoryProvider } from '@nestjs/common'
import { Route } from './route.interface'

export interface ProxyOptions {
  routes?: Route[]
  extras?: HttpProxy.ServerOptions
}

export interface ProxyAsyncOptions {
  name?: string
  useFactory?: (...args: any[]) => Promise<ProxyOptions> | ProxyOptions
  inject?: FactoryProvider['inject']
  dependencies?: FactoryProvider['inject']
}
