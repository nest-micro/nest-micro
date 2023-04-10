import { ServerInstance } from '@nest-micro/discovery'
import { Loadbalancer } from '../loadbalancer'

export interface LoadbalanceRule {
  init(loadbalancer: Loadbalancer): void

  choose(): ServerInstance | null
}
