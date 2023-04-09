import { ip } from 'address'
import { NacosNamingClient } from 'nacos'
import { Logger, Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { DiscoveryService } from '@nest-micro/discovery'
import { DISCOVERY_NACOS_OPTIONS } from './nacos.constants'
import {
  DiscoveryNacosOptions,
  NacosNamingInstance,
  NacosNamingInstanceOptions,
  NacosNamingSubscribeOptions,
} from './nacos.interface'

@Injectable()
export class DiscoveryNacosService implements OnModuleInit, OnModuleDestroy {
  private namingClient: any
  private readonly logger = new Logger(DiscoveryNacosService.name)

  constructor(
    @Inject(DISCOVERY_NACOS_OPTIONS) private readonly options: DiscoveryNacosOptions,
    private readonly discoveryService: DiscoveryService
  ) {
    this.namingClient = new NacosNamingClient({
      ...this.options.client,
      logger: console,
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
        this.discoveryService.setService(subscribe.serviceName, instances)
      })
    }
  }

  subscribe(subscribe: string | NacosNamingSubscribeOptions, listener: (instances: NacosNamingInstance[]) => void) {
    this.logger.log(`subscribe ${typeof subscribe === 'string' ? subscribe : subscribe.serviceName}`)
    return this.namingClient.subscribe(subscribe, listener)
  }

  unSubscribe(subscribe: string | NacosNamingSubscribeOptions, listener: (instances: NacosNamingInstance[]) => void) {
    this.logger.log(`unSubscribe ${typeof subscribe === 'string' ? subscribe : subscribe.serviceName}`)
    return this.namingClient.unSubscribe(subscribe, listener)
  }

  registerInstance(instance: NacosNamingInstanceOptions) {
    this.logger.log(`registerInstance ${instance.serviceName}-${instance.ip}:${instance.port}`)
    return this.namingClient.registerInstance(instance.serviceName, instance, instance.groupName) as Promise<void>
  }

  deregisterInstance(instance: NacosNamingInstanceOptions) {
    this.logger.log(`deregisterInstance ${instance.serviceName}-${instance.ip}:${instance.port}`)
    return this.namingClient.deregisterInstance(instance.serviceName, instance, instance.groupName) as Promise<void>
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
}
