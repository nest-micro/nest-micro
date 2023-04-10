import { ServerInstance } from '@nest-micro/discovery'
import { LoadbalanceRule } from './interfaces'

export class Loadbalancer {
  constructor(
    private readonly id: string,
    public readonly name: string,
    public servers: ServerInstance[],
    private rule: LoadbalanceRule
  ) {
    this.servers = this.initialServers(this.servers)
  }

  choose() {
    if (!this.rule) {
      throw new Error('The rule is not exist.')
    }

    this.rule.init(this)
    return this.rule.choose()
  }

  updateRule(rule: LoadbalanceRule) {
    this.rule = rule
    this.rule.init(this)
  }

  getServer(id: string) {
    return this.servers.find((server) => server.id === id)
  }

  addServer(server: ServerInstance) {
    this.servers.push(this.initialServer(server))
  }

  removeServer(id: string) {
    this.servers = this.servers.filter((server) => server.id !== id)
  }

  private initialServers(servers: ServerInstance[]): ServerInstance[] {
    if (!servers) {
      return []
    }
    return servers.map((server) => this.initialServer(server))
  }

  private initialServer(server: ServerInstance): ServerInstance {
    if (!server.ip || !server.port) {
      throw new Error('Server does not has id or port')
    }
    return server
  }
}
