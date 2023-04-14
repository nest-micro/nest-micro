import { omit } from 'lodash'
import { Injectable, Provider, OnModuleDestroy } from '@nestjs/common'
import { CONFIG_NACOS } from '@nest-micro/common'
import { Config, ConfigStore } from '@nest-micro/config'
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
    useFactory: async (options: ConfigNacosOptions, config: Config) => {
      const configNacosImpl = new ConfigNacosImpl(options, config.store)
      await configNacosImpl.init()
      return configNacosImpl
    },
    inject: [CONFIG_NACOS_OPTIONS, Config],
  }
}

export function createConfigNacosExisting(): Provider {
  return {
    provide: CONFIG_NACOS,
    useExisting: ConfigNacos,
  }
}
