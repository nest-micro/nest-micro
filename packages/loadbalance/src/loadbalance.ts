import { Injectable, OnApplicationBootstrap, InternalServerErrorException } from '@nestjs/common'
import { DiscoveryClient } from '@nest-micro/discovery'
import { Loadbalancer } from './loadbalancer'
import { LoadbalanceConfig } from './loadbalance.config'
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry'

@Injectable()
export class Loadbalance implements OnApplicationBootstrap {
  private readonly loadbalancers = new Map<string, Loadbalancer>()
  private readonly watcher = new Map<string, Function>()

  constructor(
    private readonly discoveryClient: DiscoveryClient,
    private readonly loadbalanceConfig: LoadbalanceConfig,
    private readonly loadbalanceRuleRegistry: LoadbalanceRuleRegistry
  ) {}

  async onApplicationBootstrap() {
    await this.init()
  }

  private async init() {
    const services: string[] = this.discoveryClient.getServiceNames()
    await this.updateServices(services)
    this.discoveryClient.watchServices(async (services: string[]) => {
      await this.updateServices(services)
    })
  }

  /**
   * 根据服务名称选择服务实例
   * @param serviceName 服务名称
   * @returns LoadbalanceServer
   */
  choose(serviceName: string) {
    const loadbalancer = this.loadbalancers.get(serviceName)
    if (!loadbalancer) {
      throw new InternalServerErrorException(`The service ${serviceName} is not exist`)
    }
    return loadbalancer.choose()
  }

  /**
   * 根据服务名称获取负载实例
   * @param serviceName 服务名称
   * @returns LoadbalanceServer
   */
  getLoadbalancer(serviceName: string): Loadbalancer {
    const loadbalancer = this.loadbalancers.get(serviceName)
    if (!loadbalancer) {
      throw new InternalServerErrorException(`The service ${serviceName} is not exist`)
    }
    return loadbalancer
  }

  private updateServices(serviceNames: string[]) {
    this.clearServiceWatcher()
    serviceNames.forEach(async (serviceName) => {
      this.createLoadbalancer(serviceName)
      this.createServiceWatcher(serviceName)
    })
  }

  private clearServiceWatcher() {
    for (const unWatch of this.watcher.values()) {
      unWatch()
    }
  }

  private createServiceWatcher(serviceName: string) {
    const unWatch = this.discoveryClient.watch(serviceName, () => {
      this.createLoadbalancer(serviceName)
    })
    this.watcher.set(serviceName, unWatch)
  }

  private createLoadbalancer(serviceName: string) {
    const servers = this.discoveryClient.getServiceServers(serviceName)
    const ruleName = this.loadbalanceConfig.getRule(serviceName)
    const rule = this.loadbalanceRuleRegistry.getRule(ruleName)
    if (!rule) {
      throw new InternalServerErrorException(`The rule ${ruleName} is not exist`)
    }
    const loadbalancer = new Loadbalancer(serviceName, servers, rule)
    this.loadbalancers.set(serviceName, loadbalancer)
  }
}
