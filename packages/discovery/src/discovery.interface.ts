import { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export interface ServerOptions {
  ip: string
  port: number
  name?: string
  status?: string
  weight?: number
  [index: string]: any
}

export interface ServiceOptions {
  name: string
  servers: ServerOptions[]
  [index: string]: any
}

export interface DiscoveryOptions {
  services?: ServiceOptions[]
}

export interface DiscoveryAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useFactory: (...args: any[]) => Promise<DiscoveryOptions> | DiscoveryOptions
  inject?: FactoryProvider['inject']
}
