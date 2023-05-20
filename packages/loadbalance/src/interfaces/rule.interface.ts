import { Loadbalancer } from '../loadbalancer'
import { LoadbalanceServer } from '../loadbalance.server'

export interface LoadbalanceRule {
  /**
   * 规则名称
   * @default 当前类名
   */
  name?: string

  /**
   * 选择服务实例
   * @param loadbalancer 当前服务的负载均衡实例
   * @returns LoadbalanceServer 选择的服务实例
   */
  choose(loadbalancer: Loadbalancer): LoadbalanceServer | null
}
