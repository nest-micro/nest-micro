import { assign } from 'lodash'
import { Provider } from '@nestjs/common'
import { ConfigService } from '@nest-micro/config'
import { DiscoveryNacosOptions, DiscoveryNacosAsyncOptions } from './nacos.interface'
import { CONFIG_PREFIX, DISCOVERY_NACOS_OPTIONS, DISCOVERY_NACOS_ROOTOPTIONS } from './nacos.constants'

export function createOptionsProvider(options: DiscoveryNacosOptions): Provider {
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
    useFactory(rootOptions: DiscoveryNacosOptions, configService: ConfigService) {
      const options = assign({}, configService.get(CONFIG_PREFIX), rootOptions)
      configService.store.set(CONFIG_PREFIX, options)
      return options
    },
    inject: [DISCOVERY_NACOS_ROOTOPTIONS, ConfigService],
  }
}
