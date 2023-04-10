import { assign } from 'lodash'
import { Provider } from '@nestjs/common'
import { Config } from '@nest-micro/config'
import { LoadbalanceOptions, LoadbalanceAsyncOptions } from './interfaces'
import { CONFIG_PREFIX, LOADBALANCE_OPTIONS, LOADBALANCE_ROOTOPTIONS } from './loadbalance.constants'

export function createOptionsProvider(options?: LoadbalanceOptions): Provider {
  return {
    provide: LOADBALANCE_ROOTOPTIONS,
    useValue: options,
  }
}

export function createAsyncOptionsProvider(options: LoadbalanceAsyncOptions): Provider {
  return {
    provide: LOADBALANCE_ROOTOPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
  }
}

export function createAssignOptionsProvider(): Provider {
  return {
    provide: LOADBALANCE_OPTIONS,
    useFactory(root: LoadbalanceOptions, config: Config) {
      const options = assign({}, config.get(CONFIG_PREFIX), root)
      config.store.set(CONFIG_PREFIX, options)
      return options
    },
    inject: [LOADBALANCE_ROOTOPTIONS, Config],
  }
}
