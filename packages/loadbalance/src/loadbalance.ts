import { Injectable, OnModuleInit } from '@nestjs/common'
import { Discovery, ServerInstance } from '@nest-micro/discovery'
import { LoadbalanceRule } from './interfaces'
import { Loadbalancer } from './loadbalancer'
import { LoadbalanceConfig } from './loadbalance.config'
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry'

@Injectable()
export class Loadbalance implements OnModuleInit {
  private readonly loadbalancers = new Map<string, Loadbalancer>()
  private readonly watcher = new Map<string, (servers: ServerInstance[]) => void>()

  constructor(
    private readonly discovery: Discovery,
    private readonly loadbalanceConfig: LoadbalanceConfig,
    private readonly loadbalanceRuleRegistry: LoadbalanceRuleRegistry
  ) {}

  async onModuleInit() {
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

  private updateServices(services: string[]) {
    this.clearServiceWatcher()
    services.forEach(async (service) => {
      const servers = this.discovery.getServiceServers(service)
      const ruleName = this.loadbalanceConfig.getRule(service)
      const rule = this.loadbalanceRuleRegistry.getRule(ruleName)
      if (!rule) {
        throw new Error(`The rule ${ruleName} is not exist`)
      }
      this.createLoadbalancer(service, servers, rule)
      this.createServiceWatcher(service, rule)
    })
  }

  private createLoadbalancer(serviceName: string, servers: ServerInstance[], rule: LoadbalanceRule) {
    this.loadbalancers.set(serviceName, new Loadbalancer(serviceName, serviceName, servers, rule))
  }

  private clearServiceWatcher() {
    for (const [service, callback] of this.watcher.entries()) {
      this.discovery.unWatch(service, callback)
    }
  }

  private createServiceWatcher(service: string, rule: LoadbalanceRule) {
    const callback = (servers: ServerInstance[]) => {
      this.createLoadbalancer(service, servers, rule)
    }
    this.watcher.set(service, callback)
    this.discovery.watch(service, callback)
  }
}
