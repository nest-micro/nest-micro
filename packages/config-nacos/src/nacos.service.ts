import { omit } from 'lodash'
import { Injectable, Provider, OnModuleDestroy } from '@nestjs/common'
import { ConfigStore } from '@nest-micro/config'
import { CONFIG_NACOS_OPTIONS } from './nacos.constants'
import { ConfigNacosOptions } from './nacos.interface'
import { NacosClientFactory } from './nacos.factory'

@Injectable()
export class ConfigNacosService {
  private readonly store: ConfigStore

  get<T>(path?: string, defaults?: T): T {
    return this.store.get<T>(path, defaults)
  }
}

@Injectable()
class ConfigNacosServiceImpl implements OnModuleDestroy {
  private readonly nacosClients: Array<NacosClientFactory> = []

  constructor(private readonly options: ConfigNacosOptions, private readonly store: ConfigStore) {}

  get<T>(path?: string, defaults?: T): T {
    return this.store.get<T>(path, defaults)
  }

  async init() {
    const { client, configs, sharedConfigs } = this.options

    if (client && configs) {
      this.nacosClients.unshift(new NacosClientFactory({ client, configs }, this.store))
    }
    if (client && sharedConfigs) {
      this.nacosClients.unshift(
        new NacosClientFactory({ client: omit(client, 'namespace'), configs: sharedConfigs }, this.store)
      )
    }

    for (const nacosClient of this.nacosClients) {
      await nacosClient.init()
    }
  }

  async onModuleDestroy() {
    for (const nacosClient of this.nacosClients) {
      await nacosClient.close()
    }
  }
}

export function createConfigNacosService(): Provider {
  return {
    provide: ConfigNacosService,
    useFactory: async (options: ConfigNacosOptions, store: ConfigStore) => {
      const ConfigNacosService = new ConfigNacosServiceImpl(options, store)
      await ConfigNacosService.init()
      return ConfigNacosService
    },
    inject: [CONFIG_NACOS_OPTIONS, ConfigStore],
  }
}
