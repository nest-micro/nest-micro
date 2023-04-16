import { Injectable } from '@nestjs/common'
import { Loadbalancer, LoadbalanceRule, RegisterRule } from '@nest-micro/loadbalance'

@Injectable()
@RegisterRule()
export class FirstRule implements LoadbalanceRule {
  // public name = 'CustomNameRule'
  private loadbalancer!: Loadbalancer

  init(loadbalancer: Loadbalancer) {
    this.loadbalancer = loadbalancer
  }

  choose() {
    const reachableServers = this.loadbalancer.servers.filter((s) => s.status !== false)
    const reachableServersCount = reachableServers.length

    if (reachableServersCount === 0) {
      return null
    }

    return reachableServers[0]
  }
}
