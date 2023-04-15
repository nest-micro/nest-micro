import { random } from 'lodash'
import { Loadbalancer } from '../loadbalancer'
import { LoadbalanceRule } from '../interfaces/rule.interface'

export class RandomRule implements LoadbalanceRule {
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

    const index = random(0, reachableServersCount - 1)
    return reachableServers[index]
  }
}
