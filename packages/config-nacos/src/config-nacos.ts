import { omit } from 'lodash'
import { Injectable, Provider, OnModuleDestroy } from '@nestjs/common'
import { ConfigStore } from '@nest-micro/config'
import { CONFIG_NACOS_OPTIONS } from './config-nacos.constants'
import { ConfigNacosOptions } from './config-nacos.interface'
import { NacosClientFactory } from './config-nacos.factory'

@Injectable()
export class ConfigNacos {
  private readonly store!: ConfigStore

  get<T>(path?: string, defaults?: T): T {
    return this.store.get<T>(path, defaults)
  }
}

@Injectable()
class ConfigNacosImpl implements OnModuleDestroy {
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

export function createConfigNacos(): Provider {
  return {
    provide: ConfigNacos,
    useFactory: async (options: ConfigNacosOptions, store: ConfigStore) => {
      const configNacosImpl = new ConfigNacosImpl(options, store)
      await configNacosImpl.init()
      return configNacosImpl
    },
    inject: [CONFIG_NACOS_OPTIONS, ConfigStore],
  }
}
