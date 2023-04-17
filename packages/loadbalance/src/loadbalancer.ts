import { InternalServerErrorException } from '@nestjs/common'
import { LoadbalanceRule } from './interfaces/rule.interface'
import { LoadbalanceServer } from './loadbalance.server'

export class Loadbalancer {
  constructor(public readonly name: string, public servers: LoadbalanceServer[], private rule: LoadbalanceRule) {
    this.servers = this.initialServers(this.servers)
  }

  choose() {
    if (!this.rule) {
      throw new InternalServerErrorException('The rule is not exist.')
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

  addServer(server: LoadbalanceServer) {
    this.servers.push(this.initialServer(server))
  }

  removeServer(id: string) {
    this.servers = this.servers.filter((server) => server.id !== id)
  }

  private initialServers(servers: LoadbalanceServer[]): LoadbalanceServer[] {
    if (!servers) {
      return []
    }
    return servers.map((server) => this.initialServer(server))
  }

  private initialServer(server: LoadbalanceServer): LoadbalanceServer {
    if (!server.ip || !server.port) {
      throw new InternalServerErrorException('Server does not has id or port')
    }
    return server
  }
}
