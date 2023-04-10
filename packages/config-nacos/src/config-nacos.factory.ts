import * as YAML from 'yaml'
import { isObject, isArray } from 'lodash'
import { DataClient as ConfigNacosClient } from 'nacos'
import { ConfigStore } from '@nest-micro/config'
import { ConfigNacosInputOptions, ConfigNacosOptions } from './config-nacos.interface'
import { NACOS_DEFAULT_GROUP } from './config-nacos.constants'

export class NacosClientFactory {
  private readonly listeners: Array<ConfigNacosInputOptions & { listener: Function }> = []
  private ConfigNacosClient: ConfigNacosClient

  constructor(private readonly options: ConfigNacosOptions, private readonly store: ConfigStore) {
    this.ConfigNacosClient = new ConfigNacosClient(this.options.client!)
  }

  async init() {
    let configs: ConfigNacosInputOptions[] = []
    if (isArray(this.options.configs)) {
      configs = this.options.configs
    } else if (isObject(this.options.configs)) {
      configs = [this.options.configs]
    }
    for (const config of configs) {
      config.group = config.group || NACOS_DEFAULT_GROUP
      await this.loadConfig(config)
      this.listeners.push({
        dataId: config.dataId,
        group: config.group,
        listener: async (content: string) => {
          await this.setConfig(content)
        },
      })
    }
    this.subscribeConfig()
  }

  async close() {
    await this.unSubscribeConfig()
    await this.ConfigNacosClient.close()
  }

  private async setConfig(content: string) {
    if (!content) return
    let config = {}
    try {
      config = YAML.parse(content)
    } catch (e) {
      try {
        config = JSON.parse(content)
      } catch (e) {}
    }
    this.store.assign(config)
  }

  private async loadConfig(config: ConfigNacosInputOptions) {
    const { dataId, group, options = {} } = config
    const content = await this.ConfigNacosClient.getConfig(dataId, group, options)
    this.setConfig(content)
  }

  private async subscribeConfig() {
    for (const { dataId, group, listener } of this.listeners) {
      this.ConfigNacosClient.subscribe({ dataId, group }, listener)
    }
  }

  private async unSubscribeConfig() {
    for (const { dataId, group, listener } of this.listeners) {
      this.ConfigNacosClient.unSubscribe({ dataId, group }, listener)
    }
  }
}
