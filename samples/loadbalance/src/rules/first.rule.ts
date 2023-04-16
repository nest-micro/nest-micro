import { Loadbalancer, LoadbalanceRule } from '@nest-micro/loadbalance'

export class FirstRule implements LoadbalanceRule {
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
