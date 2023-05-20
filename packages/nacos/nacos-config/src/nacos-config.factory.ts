import * as YAML from 'yaml'
import { isObject, isArray } from 'lodash'
import { DataClient as NacosConfigClient } from 'nacos'
import { ConfigStore } from '@nest-micro/config'
import { NacosConfigInputOptions, NacosConfigOptions } from './nacos-config.interface'
import { NACOS_DEFAULT_GROUP } from './nacos-config.constants'

export class NacosClientFactory {
  private readonly listeners: Array<NacosConfigInputOptions & { listener: Function }> = []
  private NacosConfigClient: NacosConfigClient

  constructor(private readonly options: NacosConfigOptions, private readonly store: ConfigStore) {
    this.NacosConfigClient = new NacosConfigClient(this.options.client!)
  }

  async init() {
    let configs: NacosConfigInputOptions[] = []
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
    await this.NacosConfigClient.close()
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

  private async loadConfig(config: NacosConfigInputOptions) {
    const { dataId, group, options = {} } = config
    const content = await this.NacosConfigClient.getConfig(dataId, group, options)
    this.setConfig(content)
  }

  private async subscribeConfig() {
    for (const { dataId, group, listener } of this.listeners) {
      this.NacosConfigClient.subscribe({ dataId, group }, listener)
    }
  }

  private async unSubscribeConfig() {
    for (const { dataId, group, listener } of this.listeners) {
      this.NacosConfigClient.unSubscribe({ dataId, group }, listener)
    }
  }
}
