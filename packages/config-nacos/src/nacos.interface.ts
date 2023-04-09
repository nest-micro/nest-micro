import { ClientOptions as NacosClientOptions } from 'nacos'
import { FactoryProvider } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'

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

export interface ConfigNacosAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useFactory: (...args: any[]) => Promise<ConfigNacosOptions> | ConfigNacosOptions
  inject?: FactoryProvider['inject']
}
