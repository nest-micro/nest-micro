import { assign } from 'lodash'
import { Provider } from '@nestjs/common'
import { Config } from '@nest-micro/config'
import { ConfigNacosOptions, ConfigNacosAsyncOptions } from './config-nacos.interface'
import { CONFIG_PREFIX, CONFIG_NACOS_OPTIONS, CONFIG_NACOS_ROOTOPTIONS } from './config-nacos.constants'

export function createOptionsProvider(options?: ConfigNacosOptions): Provider {
  return {
    provide: CONFIG_NACOS_ROOTOPTIONS,
    useValue: options,
  }
}

export function createAsyncOptionsProvider(options: ConfigNacosAsyncOptions): Provider {
  return {
    provide: CONFIG_NACOS_ROOTOPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
  }
}

export function createAssignOptionsProvider(): Provider {
  return {
    provide: CONFIG_NACOS_OPTIONS,
    useFactory(root: ConfigNacosOptions, config: Config) {
      const options = assign({}, config.get(CONFIG_PREFIX), root)
      config.store.set(CONFIG_PREFIX, options)
      return options
    },
    inject: [CONFIG_NACOS_ROOTOPTIONS, Config],
  }
}
