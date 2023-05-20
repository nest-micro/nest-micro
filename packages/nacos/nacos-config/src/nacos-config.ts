import { omit } from 'lodash'
import { Injectable, Provider, OnModuleDestroy } from '@nestjs/common'
import { NACOS_CONFIG } from '@nest-micro/common'
import { Config, ConfigStore } from '@nest-micro/config'
import { NACOS_CONFIG_OPTIONS } from './nacos-config.constants'
import { NacosConfigOptions } from './nacos-config.interface'
import { NacosClientFactory } from './nacos-config.factory'

@Injectable()
export class NacosConfig {
  private readonly store!: ConfigStore

  /**
   * 根据 path 路径获取值(与 lodash.get 一致)
   * @param path 要获取属性的路径
   * @param defaults 默认值，如果解析值是 undefined 则返回
   * @returns T
   */
  get<T>(path?: string, defaults?: T): T {
    return this.store.get<T>(path, defaults)
  }
}

@Injectable()
class NacosConfigImpl implements OnModuleDestroy {
  private readonly nacosClients: Array<NacosClientFactory> = []

  constructor(private readonly options: NacosConfigOptions, private readonly store: ConfigStore) {}

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

export function createNacosConfig(): Provider {
  return {
    provide: NacosConfig,
    useFactory: async (options: NacosConfigOptions, config: Config) => {
      const nacosConfigImpl = new NacosConfigImpl(options, config.store)
      await nacosConfigImpl.init()
      return nacosConfigImpl
    },
    inject: [NACOS_CONFIG_OPTIONS, Config],
  }
}

export function createNacosConfigExisting(): Provider {
  return {
    provide: NACOS_CONFIG,
    useExisting: NacosConfig,
  }
}
