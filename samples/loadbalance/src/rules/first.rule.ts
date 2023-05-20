import { Injectable } from '@nestjs/common'
import { Loadbalancer, LoadbalanceRule, RegisterRule } from '@nest-micro/loadbalance'

@Injectable()
@RegisterRule()
export class FirstRule implements LoadbalanceRule {
  // public name = 'CustomNameRule'

  choose(loadbalancer: Loadbalancer) {
    const reachableServers = loadbalancer.servers
    const reachableServersCount = reachableServers.length

    if (reachableServersCount === 0) {
      return null
    }

    return reachableServers[0]
  }
}
