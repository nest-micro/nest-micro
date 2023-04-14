import { ClientOptions as NacosClientOptions } from 'nacos'
import { FactoryProvider } from '@nestjs/common'

export interface ConfigNacosInputOptions {
  dataId: string
  group?: string
  options?: {
    unit?: string
  }
}

export interface ConfigNacosOptions {
  client?: NacosClientOptions
  configs?: ConfigNacosInputOptions | ConfigNacosInputOptions[]
  sharedConfigs?: ConfigNacosInputOptions | ConfigNacosInputOptions[]
}

export interface ConfigNacosAsyncOptions {
  name?: string
  useFactory?: (...args: any[]) => Promise<ConfigNacosOptions> | ConfigNacosOptions
  inject?: FactoryProvider['inject']
  dependencies?: FactoryProvider['inject']
}
