import { Inject } from '@nestjs/common'
import { ServerOptions, DiscoveryOptions } from './discovery.interface'
import { DISCOVERY_OPTIONS } from './discovery.constants'

type IServices = { [service: string]: ServerOptions[] }
type ICallbackServer = (servers: ServerOptions[]) => void
type ICallbackService = (services: IServices) => void

export class DiscoveryService {
  private readonly services: IServices = {}
  private readonly serviceCallbackMaps = new Map<string, Set<ICallbackServer>>()
  private readonly serviceCallbackSets = new Set<ICallbackService>()

  constructor(@Inject(DISCOVERY_OPTIONS) private readonly options: DiscoveryOptions) {
    if (this.options.services) {
      for (const service of this.options.services) {
        this.setService(service.name, service.servers)
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
  }

  watchServices(callback: ICallbackService) {
    this.serviceCallbackSets.add(callback)
  }

  getServices(): IServices {
    return this.services
  }

  getServiceNames(): string[] {
    return Object.keys(this.services)
  }

  getServiceServers(name: string): ServerOptions[] {
    return this.services[name] || []
  }

  setService(name: string, servers: ServerOptions[]) {
    this.services[name] = servers

    if (this.serviceCallbackMaps.has(name)) {
      const callbacks = this.serviceCallbackMaps.get(name)
      callbacks.forEach((cb) => cb(servers))
    }

    this.serviceCallbackSets.forEach((cb) => cb(this.services))
  }
}
