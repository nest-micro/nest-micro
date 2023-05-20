import { concat, assign } from 'lodash'
import { Module, DynamicModule, Global, Provider } from '@nestjs/common'
import { CONFIG, NACOS_DISCOVERY } from '@nest-micro/common'
import { CONFIG_PREFIX, NACOS_DISCOVERY_OPTIONS } from './nacos-discovery.constants'
import { NacosDiscoveryOptions, NacosDiscoveryAsyncOptions } from './nacos-discovery.interface'
import { NacosDiscovery } from './nacos-discovery'

@Global()
@Module({})
export class NacosDiscoveryModule {
  static forRoot(options?: NacosDiscoveryOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: NacosDiscoveryAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: NacosDiscoveryAsyncOptions) {
    const inject = options.inject || []
    const dependencies = options.dependencies || []

    const OptionsProvider: Provider = {
      provide: NACOS_DISCOVERY_OPTIONS,
      async useFactory(...params: any[]) {
        const config = params[dependencies.indexOf(CONFIG)]
        const configOptions = config?.get(CONFIG_PREFIX)
        const factoryOptions = await options.useFactory?.(...params.slice(dependencies.length))
        const assignOptions = assign({}, configOptions, factoryOptions)
        config?.store.set(CONFIG_PREFIX, assignOptions)
        return assignOptions
      },
      inject: concat(dependencies, inject),
    }

    const NacosDiscoveryExisting: Provider = {
      provide: NACOS_DISCOVERY,
      useExisting: NacosDiscovery,
    }

    return {
      module: NacosDiscoveryModule,
      providers: [OptionsProvider, NacosDiscovery, NacosDiscoveryExisting],
      exports: [NacosDiscovery, NacosDiscoveryExisting],
    }
  }
}
