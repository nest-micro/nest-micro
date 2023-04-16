import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Discovery } from '@nest-micro/discovery'
import { Loadbalancer } from './loadbalancer'
import { LoadbalanceConfig } from './loadbalance.config'
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry'

@Injectable()
export class Loadbalance implements OnApplicationBootstrap {
  private readonly loadbalancers = new Map<string, Loadbalancer>()
  private readonly watcher = new Map<string, Function>()

  constructor(
    private readonly discovery: Discovery,
    private readonly loadbalanceConfig: LoadbalanceConfig,
    private readonly loadbalanceRuleRegistry: LoadbalanceRuleRegistry
  ) {}

  async onApplicationBootstrap() {
    await this.init()
  }

  async init() {
    const services: string[] = this.discovery.getServiceNames()
    await this.updateServices(services)
    this.discovery.watchServices(async (services: string[]) => {
      await this.updateServices(services)
    })
  }

  choose(serviceName: string) {
    const loadbalancer = this.loadbalancers.get(serviceName)
    if (!loadbalancer) {
      throw new Error(`The service ${serviceName} is not exist`)
    }
    return loadbalancer.choose()
  }

  getLoadbalancer(serviceName: string): Loadbalancer {
    const loadbalancer = this.loadbalancers.get(serviceName)
    if (!loadbalancer) {
      throw new Error(`The service ${serviceName} is not exist`)
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
    const unWatch = this.discovery.watch(serviceName, () => {
      this.createLoadbalancer(serviceName)
    })
    this.watcher.set(serviceName, unWatch)
  }

  private createLoadbalancer(serviceName: string) {
    const servers = this.discovery.getServiceServers(serviceName)
    const ruleName = this.loadbalanceConfig.getRule(serviceName)
    const rule = this.loadbalanceRuleRegistry.getRule(ruleName)
    if (!rule) {
      throw new Error(`The rule ${ruleName} is not exist`)
    }
    const loadbalancer = new Loadbalancer(serviceName, servers, rule)
    this.loadbalancers.set(serviceName, loadbalancer)
  }
}
