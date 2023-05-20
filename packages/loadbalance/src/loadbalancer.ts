import { InternalServerErrorException } from '@nestjs/common'
import { LoadbalanceRule } from './interfaces/rule.interface'
import { LoadbalanceServer } from './loadbalance.server'

export class Loadbalancer {
  constructor(public readonly name: string, public servers: LoadbalanceServer[], private rule: LoadbalanceRule) {
    this.servers = this.initialServers(this.servers)
  }

  /**
   * 选择服务实例
   * @returns LoadbalanceServer
   */
  choose() {
    if (!this.rule) {
      throw new InternalServerErrorException('The rule is not exist.')
    }

    return this.rule.choose(this)
  }

  /**
   * 更新规则
   * @param rule 规则
   */
  updateRule(rule: LoadbalanceRule) {
    this.rule = rule
  }

  /**
   * 获取服务实例
   * @param id 实例id
   * @returns 服务实例
   */
  getServer(id: string) {
    return this.servers.find((server) => server.id === id)
  }

  /**
   * 添加服务实例
   * @param server 服务实例
   */
  addServer(server: LoadbalanceServer) {
    this.servers.push(this.initialServer(server))
  }

  /**
   * 删除服务实例
   * @param id 实例id
   */
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
