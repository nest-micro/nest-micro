import { Inject } from '@nestjs/common'
import { isEqual } from 'lodash'
import { ServerInstance, DiscoveryOptions } from './discovery.interface'
import { DISCOVERY_OPTIONS } from './discovery.constants'

type IServices = { [service: string]: ServerInstance[] }
type ICallbackServer = (servers: ServerInstance[]) => void
type ICallbackService = (services: string[]) => void

export class Discovery {
  private readonly services: IServices = {}
  private servicesNamesCache: string[] = []
  private readonly serviceCallbackMaps = new Map<string, Set<ICallbackServer>>()
  private readonly serviceCallbackSets = new Set<ICallbackService>()

  constructor(@Inject(DISCOVERY_OPTIONS) private readonly options: DiscoveryOptions) {
    if (this.options.services) {
      for (const service of this.options.services) {
        this.setServiceServers(service.name, service.servers)
      }
    }
  }

  watch(name: string, callback: ICallbackServer) {
    const callbacks = this.serviceCallbackMaps.get(name)
    if (callbacks) {
      callbacks.add(callback)
    } else {
      this.serviceCallbackMaps.set(name, new Set([callback]))
    }
    return () => this.unWatch(name, callback)
  }

  unWatch(name: string, callback: ICallbackServer) {
    const callbacks = this.serviceCallbackMaps.get(name)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  watchServices(callback: ICallbackService) {
    this.serviceCallbackSets.add(callback)
    return () => this.unWatchServices(callback)
  }

  unWatchServices(callback: ICallbackService) {
    this.serviceCallbackSets.delete(callback)
  }

  getServices(): IServices {
    return this.services
  }

  getServiceNames(): string[] {
    return Object.keys(this.services)
  }

  getServiceServers(name: string): ServerInstance[] {
    return this.services[name] || []
  }

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
