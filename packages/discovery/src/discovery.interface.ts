import { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export interface ServerInstance {
  id: string
  ip: string
  port: number
  name?: string
  status?: boolean
  weight?: number
  [index: string]: any
}

export interface ServiceInstance {
  name: string
  servers: ServerInstance[]
  [index: string]: any
}

export interface DiscoveryOptions {
  services?: ServiceInstance[]
}

export interface DiscoveryAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useFactory: (...args: any[]) => Promise<DiscoveryOptions> | DiscoveryOptions
  inject?: FactoryProvider['inject']
}
