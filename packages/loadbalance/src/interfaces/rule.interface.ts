import { Loadbalancer } from '../loadbalancer'
import { LoadbalanceServer } from '../loadbalance.server'

export interface LoadbalanceRule {
  init(loadbalancer: Loadbalancer): void

  choose(): LoadbalanceServer | null
}
