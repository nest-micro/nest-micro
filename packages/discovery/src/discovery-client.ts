import { Inject, Injectable } from '@nestjs/common'
import { isEqual } from 'lodash'
import { ServerInstance, DiscoveryOptions } from './discovery.interface'
import { DISCOVERY_OPTIONS } from './discovery.constants'

type IServices = { [service: string]: ServerInstance[] }
type ICallbackServer = (servers: ServerInstance[]) => void
type ICallbackService = (services: string[]) => void

@Injectable()
export class DiscoveryClient {
  private readonly services: IServices = {}
  private servicesNamesCache: string[] = []
  private readonly serviceCallbackMaps = new Map<string, Set<ICallbackServer>>()
  private readonly serviceCallbackSets = new Set<ICallbackService>()

  constructor(@Inject(DISCOVERY_OPTIONS) private readonly options: DiscoveryOptions) {
    const services = this.options.services || []
    for (const service of services) {
      this.setServiceServers(service.name, service.servers)
    }
  }

  /**
   * 订阅实例列表改变
   * @param name 服务名称
   * @param callback(servers: ServerInstance[]) 回调函数
   * @returns unWatch 取消订阅的函数
   */
  watch(name: string, callback: ICallbackServer) {
    const callbacks = this.serviceCallbackMaps.get(name)
    if (callbacks) {
      callbacks.add(callback)
    } else {
      this.serviceCallbackMaps.set(name, new Set([callback]))
    }
    return () => this.unWatch(name, callback)
  }

  /**
   * 取消订阅实例列表改变
   * @param name 服务名称
   * @param callback 回调函数
   */
  unWatch(name: string, callback: ICallbackServer) {
    const callbacks = this.serviceCallbackMaps.get(name)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  /**
   * 订阅服务列表改变
   * @param callback(services: string[]) 回调函数
   * @returns unWatchServices 取消订阅的函数
   */
  watchServices(callback: ICallbackService) {
    this.serviceCallbackSets.add(callback)
    return () => this.unWatchServices(callback)
  }

  /**
   * 取消订阅服务列表改变
   * @param callback 回调函数
   */
  unWatchServices(callback: ICallbackService) {
    this.serviceCallbackSets.delete(callback)
  }

  /**
   * 获取所有的服务
   * @returns IServices
   */
  getServices(): IServices {
    return this.services
  }

  /**
   * 获取所有的服务名称
   * @returns string[]
   */
  getServiceNames(): string[] {
    return Object.keys(this.services)
  }

  /**
   * 根据服务名称获取实例列表
   * @param name 服务名称
   * @returns ServerInstance[] 实例列表
   */
  getServiceServers(name: string): ServerInstance[] {
    return this.services[name] || []
  }

  /**
   * 根据服务名称设置实例列表
   * @param name 服务名称
   * @param servers 实例列表
   */
  setServiceServers(name: string, servers: ServerInstance[]) {
    this.services[name] = servers

    if (this.serviceCallbackMaps.has(name)) {
      const callbacks = this.serviceCallbackMaps.get(name)!
      callbacks.forEach((cb) => cb(servers))
    }

    const serviceNames = this.getServiceNames()
    if (!isEqual(serviceNames, this.servicesNamesCache)) {
      this.servicesNamesCache = serviceNames
      this.serviceCallbackSets.forEach((cb) => cb(serviceNames))
    }
  }
}
