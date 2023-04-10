import { assign } from 'lodash'
import { Provider } from '@nestjs/common'
import { Config } from '@nest-micro/config'
import { DiscoveryOptions, DiscoveryAsyncOptions } from './discovery.interface'
import { CONFIG_PREFIX, DISCOVERY_OPTIONS, DISCOVERY_ROOTOPTIONS } from './discovery.constants'

export function createOptionsProvider(options?: DiscoveryOptions): Provider {
  return {
    provide: DISCOVERY_ROOTOPTIONS,
    useValue: options,
  }
}

export function createAsyncOptionsProvider(options: DiscoveryAsyncOptions): Provider {
  return {
    provide: DISCOVERY_ROOTOPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
  }
}

export function createAssignOptionsProvider(): Provider {
  return {
    provide: DISCOVERY_OPTIONS,
    useFactory(root: DiscoveryOptions, config: Config) {
      const options = assign({}, config.get(CONFIG_PREFIX), root)
      config.store.set(CONFIG_PREFIX, options)
      return options
    },
    inject: [DISCOVERY_ROOTOPTIONS, Config],
  }
}
