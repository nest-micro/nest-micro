import { random } from 'lodash'
import { LoadbalanceRule } from '../interfaces'
import { Loadbalancer } from '../loadbalancer'

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
