import { ClientOptions as NacosClientOptions } from 'nacos'
import { FactoryProvider } from '@nestjs/common'

export interface NacosConfigInputOptions {
  dataId: string
  group?: string
  options?: {
    unit?: string
  }
}

export interface NacosConfigOptions {
  /**
   * 客户端连接配置
   */
  client?: NacosClientOptions
  /**
   * 配置列表
   */
  configs?: NacosConfigInputOptions | NacosConfigInputOptions[]
  /**
   * public 命名空间下的配置列表
   */
  sharedConfigs?: NacosConfigInputOptions | NacosConfigInputOptions[]
}

export interface NacosConfigAsyncOptions {
  name?: string
  useFactory?: (...args: any[]) => Promise<NacosConfigOptions> | NacosConfigOptions
  inject?: FactoryProvider['inject']
  dependencies?: FactoryProvider['inject']
}
