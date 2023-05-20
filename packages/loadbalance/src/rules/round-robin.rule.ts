import { Injectable } from '@nestjs/common'
import { Loadbalancer } from '../loadbalancer'
import { LoadbalanceRule } from '../interfaces/rule.interface'
import { RegisterRule } from '../decorators/register-rule.decorator'

/**
 * 轮训负载均衡规则
 */
@Injectable()
@RegisterRule()
export class RoundRobinRule implements LoadbalanceRule {
  private counter = 0

  choose(loadbalancer: Loadbalancer) {
    const reachableServers = loadbalancer.servers.filter((s) => s.status !== false)
    const reachableServersCount = reachableServers.length

    if (reachableServersCount === 0) {
      return null
    }

    const index = this.incrementAndGetModulo(reachableServersCount)
    return reachableServers[index]
  }

  private incrementAndGetModulo(modulo: number) {
    return (this.counter = (this.counter + 1) % modulo)
  }
}
