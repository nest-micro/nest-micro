import { Loadbalancer } from '../loadbalancer'
import { LoadbalanceServer } from '../loadbalance.server'

export interface LoadbalanceRule {
  name?: string

  init(loadbalancer: Loadbalancer): void

  choose(): LoadbalanceServer | null
}
