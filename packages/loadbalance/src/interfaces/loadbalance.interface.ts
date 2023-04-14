import { FactoryProvider } from '@nestjs/common'

export interface ServiceOptions {
  name: string
  rule: string
}

export interface LoadbalanceOptions {
  rule?: string
  services?: ServiceOptions[]
}

export interface LoadbalanceAsyncOptions {
  name?: string
  useFactory?: (...args: any[]) => Promise<LoadbalanceOptions> | LoadbalanceOptions
  inject?: FactoryProvider['inject']
  dependencies?: FactoryProvider['inject']
}
