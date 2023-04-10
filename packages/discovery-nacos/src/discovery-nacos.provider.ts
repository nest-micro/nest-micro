import { assign } from 'lodash'
import { Provider } from '@nestjs/common'
import { Config } from '@nest-micro/config'
import { DiscoveryNacosOptions, DiscoveryNacosAsyncOptions } from './discovery-nacos.interface'
import { CONFIG_PREFIX, DISCOVERY_NACOS_OPTIONS, DISCOVERY_NACOS_ROOTOPTIONS } from './discovery-nacos.constants'

export function createOptionsProvider(options?: DiscoveryNacosOptions): Provider {
  return {
    provide: DISCOVERY_NACOS_ROOTOPTIONS,
    useValue: options,
  }
}

export function createAsyncOptionsProvider(options: DiscoveryNacosAsyncOptions): Provider {
  return {
    provide: DISCOVERY_NACOS_ROOTOPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
  }
}

export function createAssignOptionsProvider(): Provider {
  return {
    provide: DISCOVERY_NACOS_OPTIONS,
    useFactory(root: DiscoveryNacosOptions, config: Config) {
      const options = assign({}, config.get(CONFIG_PREFIX), root)
      config.store.set(CONFIG_PREFIX, options)
      return options
    },
    inject: [DISCOVERY_NACOS_ROOTOPTIONS, Config],
  }
}
