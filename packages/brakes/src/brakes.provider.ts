import { assign } from 'lodash'
import { Provider } from '@nestjs/common'
import { Config } from '@nest-micro/config'
import { BrakesOptions, BrakesAsyncOptions } from './interfaces/brakes.interface'
import { CONFIG_PREFIX, BRAKES_OPTIONS, BRAKES_ROOTOPTIONS } from './brakes.constants'

export function createOptionsProvider(options?: BrakesOptions): Provider {
  return {
    provide: BRAKES_ROOTOPTIONS,
    useValue: options,
  }
}

export function createAsyncOptionsProvider(options: BrakesAsyncOptions): Provider {
  return {
    provide: BRAKES_ROOTOPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
  }
}

export function createAssignOptionsProvider(): Provider {
  return {
    provide: BRAKES_OPTIONS,
    useFactory(root: BrakesOptions, config: Config) {
      const options = assign({}, config.get(CONFIG_PREFIX), root)
      config.store.set(CONFIG_PREFIX, options)
      return options
    },
    inject: [BRAKES_ROOTOPTIONS, Config],
  }
}
