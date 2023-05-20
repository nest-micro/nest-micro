import { ip } from 'address'
import { NacosNamingClient } from 'nacos'
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { DiscoveryClient } from '@nest-micro/discovery'
import { NACOS_DISCOVERY_OPTIONS } from './nacos-discovery.constants'
import { NoopLogger } from './nacos-discovery.logger'
import {
  NacosDiscoveryOptions,
  NacosNamingInstance,
  NacosNamingInstanceOptions,
  NacosNamingSubscribeOptions,
} from './nacos-discovery.interface'

@Injectable()
export class NacosDiscovery implements OnModuleInit, OnModuleDestroy {
  private namingClient: any

  constructor(
    @Inject(NACOS_DISCOVERY_OPTIONS) private readonly options: NacosDiscoveryOptions,
    private readonly discoveryClient: DiscoveryClient
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

  /**
   * 订阅服务
   * @param subscribe 订阅信息
   * @param listener 回调函数
   * @returns unSubscribe
   */
  subscribe(subscribe: string | NacosNamingSubscribeOptions, listener: (instances: NacosNamingInstance[]) => void) {
    this.namingClient.subscribe(subscribe, listener)
    return () => this.unSubscribe(subscribe, listener)
  }

  /**
   * 取消订阅服务
   * @param subscribe 订阅信息
   * @param listener 回调函数
   */
  unSubscribe(subscribe: string | NacosNamingSubscribeOptions, listener: (instances: NacosNamingInstance[]) => void) {
    this.namingClient.unSubscribe(subscribe, listener)
  }

  /**
   * 注册实例
   * @param instance 实例信息
   * @returns deregisterInstance
   */
  async registerInstance(instance: NacosNamingInstanceOptions) {
    await this.namingClient.registerInstance(instance.serviceName, instance, instance.groupName)
    return () => this.deregisterInstance(instance)
  }

  /**
   * 注销实例
   * @param instance 实例信息
   */
  async deregisterInstance(instance: NacosNamingInstanceOptions) {
    return this.namingClient.deregisterInstance(instance.serviceName, instance, instance.groupName)
  }

  /**
   * 获取所有实例列表
   * @param serviceName 服务名称
   * @param groupName 分组名
   * @param clusters
   * @param subscribe
   * @returns 实例列表
   */
  getAllInstances(serviceName: string, groupName?: string, clusters?: string, subscribe?: boolean) {
    return this.namingClient.getAllInstances(serviceName, groupName, clusters, subscribe) as Promise<
      NacosNamingInstance[]
    >
  }

  /**
   * 获取可用实例列表
   * @param serviceName 服务名称
   * @param groupName 分组名
   * @param clusters
   * @param healthy
   * @param subscribe
   * @returns 实例列表
   */
  selectInstances(serviceName: string, groupName?: string, clusters?: string, healthy?: boolean, subscribe?: boolean) {
    return this.namingClient.selectInstances(serviceName, groupName, clusters, healthy, subscribe) as Promise<
      NacosNamingInstance[]
    >
  }

  /**
   * 获取服务状态
   * @returns 'UP' | 'DOWN'
   */
  getServerStatus() {
    return this.namingClient.getServerStatus() as Promise<'UP' | 'DOWN'>
  }

  /**
   * 初始化注册实例
   * @returns
   */
  private async initInstances() {
    if (!this.options.instance) return null
    await this.registerInstance({
      ip: ip(),
      ...this.options.instance,
    })
  }

  /**
   * 初始化订阅服务
   * @returns
   */
  private async initSubscribes() {
    if (!this.options.subscribes) return null
    for (const subscribe of this.options.subscribes) {
      this.subscribe(subscribe, (instances: NacosNamingInstance[]) => {
        this.setDiscoveryService(subscribe.serviceName, instances)
      })
    }
  }

  /**
   * 更新服务到 @nest-micro/discovery 中管理
   * @param name 服务名称
   * @param instances 实例列表
   */
  private async setDiscoveryService(name: string, instances: NacosNamingInstance[]) {
    this.discoveryClient.setServiceServers(
      name,
      instances.map((instance) => ({
        ...instance,
        id: instance.instanceId,
        status: instance.healthy && instance.enabled,
      }))
    )
  }
}
