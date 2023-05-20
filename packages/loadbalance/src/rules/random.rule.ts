import { random } from 'lodash'
import { Injectable } from '@nestjs/common'
import { Loadbalancer } from '../loadbalancer'
import { LoadbalanceRule } from '../interfaces/rule.interface'
import { RegisterRule } from '../decorators/register-rule.decorator'

/**
 * 随机负载均衡规则
 */
@Injectable()
@RegisterRule()
export class RandomRule implements LoadbalanceRule {
  choose(loadbalancer: Loadbalancer) {
    const reachableServers = loadbalancer.servers.filter((s) => s.status !== false)
    const reachableServersCount = reachableServers.length

    if (reachableServersCount === 0) {
      return null
    }

    const index = random(0, reachableServersCount - 1)
    return reachableServers[index]
  }
}
