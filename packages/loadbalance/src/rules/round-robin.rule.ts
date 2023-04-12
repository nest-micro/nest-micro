import { LoadbalanceRule } from '../interfaces'
import { Loadbalancer } from '../loadbalancer'

export class RoundRobinRule implements LoadbalanceRule {
  protected loadbalancer!: Loadbalancer
  private counter = 0

  init(loadbalancer: Loadbalancer) {
    this.loadbalancer = loadbalancer
  }

  choose() {
    const reachableServers = this.loadbalancer.servers.filter((s) => s.status !== false)
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