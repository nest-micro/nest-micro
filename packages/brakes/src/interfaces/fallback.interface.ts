import { BrakesOptions } from './brakes.interface'

export interface Fallback {
  config?(): BrakesOptions

  fallback(): Promise<any> | void

  healthCheck?(): Promise<any>
}
