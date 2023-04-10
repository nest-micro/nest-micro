import { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export interface ServiceOptions {
  name: string
  rule: string
}

export interface LoadbalanceOptions {
  rule?: string
  services?: ServiceOptions[]
}

export interface LoadbalanceAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useFactory: (...args: any[]) => Promise<LoadbalanceOptions> | LoadbalanceOptions
  inject?: FactoryProvider['inject']
}
