import { ip } from 'address'
import { NacosNamingClient } from 'nacos'
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Discovery } from '@nest-micro/discovery'
import { DISCOVERY_NACOS_OPTIONS } from './discovery-nacos.constants'
import { NoopLogger } from './discovery-nacos.logger'
import {
  DiscoveryNacosOptions,
  NacosNamingInstance,
  NacosNamingInstanceOptions,
  NacosNamingSubscribeOptions,
} from './discovery-nacos.interface'

@Injectable()
export class DiscoveryNacos implements OnModuleInit, OnModuleDestroy {
  private namingClient: any

  constructor(
    @Inject(DISCOVERY_NACOS_OPTIONS) private readonly options: DiscoveryNacosOptions,
    private readonly discovery: Discovery
  ) {
    this.namingClient = new NacosNamingClient({
      ...this.options.client!,
      logger: this.options.logger !== false ? console : (NoopLogger as unknown as Console),
    })
  }

  async onModuleInit() {
    await this.namingClient.ready()
    await this.initInstances()
    await this.initSubscribes()
  }

  async onModuleDestroy() {
    await this.namingClient.close()
  }

  subscribe(subscribe: string | NacosNamingSubscribeOptions, listener: (instances: NacosNamingInstance[]) => void) {
    this.namingClient.subscribe(subscribe, listener)
    return () => this.unSubscribe(subscribe, listener)
  }

  unSubscribe(subscribe: string | NacosNamingSubscribeOptions, listener: (instances: NacosNamingInstance[]) => void) {
    this.namingClient.unSubscribe(subscribe, listener)
  }

  registerInstance(instance: NacosNamingInstanceOptions) {
    this.namingClient.registerInstance(instance.serviceName, instance, instance.groupName) as Promise<void>
    return () => this.deregisterInstance(instance)
  }

  deregisterInstance(instance: NacosNamingInstanceOptions) {
    this.namingClient.deregisterInstance(instance.serviceName, instance, instance.groupName) as Promise<void>
  }

  getAllInstances(serviceName: string, groupName?: string, clusters?: string, subscribe?: boolean) {
    return this.namingClient.getAllInstances(serviceName, groupName, clusters, subscribe) as Promise<
      NacosNamingInstance[]
    >
  }

  selectInstances(serviceName: string, groupName?: string, clusters?: string, healthy?: boolean, subscribe?: boolean) {
    return this.namingClient.selectInstances(serviceName, groupName, clusters, healthy, subscribe) as Promise<
      NacosNamingInstance[]
    >
  }

  getServerStatus() {
    return this.namingClient.getServerStatus() as Promise<'UP' | 'DOWN'>
  }

  private async initInstances() {
    if (!this.options.instance) return null
    await this.registerInstance({
      ip: ip(),
      ...this.options.instance,
    })
  }

  private async initSubscribes() {
    if (!this.options.subscribes) return null
    for (const subscribe of this.options.subscribes) {
      this.subscribe(subscribe, (instances: NacosNamingInstance[]) => {
        this.setDiscoveryService(subscribe.serviceName, instances)
      })
    }
  }

  private async setDiscoveryService(name: string, instances: NacosNamingInstance[]) {
    this.discovery.setServiceServers(
      name,
      instances.map((instance) => ({
        ...instance,
        id: instance.instanceId,
        status: instance.healthy && instance.enabled,
      }))
    )
  }
}
