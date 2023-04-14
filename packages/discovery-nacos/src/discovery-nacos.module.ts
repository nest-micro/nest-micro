import { concat, assign } from 'lodash'
import { Module, DynamicModule, Global, Provider } from '@nestjs/common'
import { CONFIG, DISCOVERY_NACOS } from '@nest-micro/common'
import { CONFIG_PREFIX, DISCOVERY_NACOS_OPTIONS } from './discovery-nacos.constants'
import { DiscoveryNacosOptions, DiscoveryNacosAsyncOptions } from './discovery-nacos.interface'
import { DiscoveryNacos } from './discovery-nacos'

@Global()
@Module({})
export class DiscoveryNacosModule {
  static forRoot(options?: DiscoveryNacosOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: DiscoveryNacosAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: DiscoveryNacosAsyncOptions) {
    const inject = options.inject || []
    const dependencies = options.dependencies || []

    const OptionsProvider: Provider = {
      provide: DISCOVERY_NACOS_OPTIONS,
      async useFactory(...params: any[]) {
        const config = params[dependencies.indexOf(CONFIG)]
        const configOptions = config?.get(CONFIG_PREFIX)
        const factoryOptions = await options.useFactory?.(params.slice(dependencies.length))
        const assignOptions = assign({}, configOptions, factoryOptions)
        config?.store.set(CONFIG_PREFIX, assignOptions)
        return assignOptions
      },
      inject: concat(dependencies, inject),
    }

    const DiscoveryNacosExisting: Provider = {
      provide: DISCOVERY_NACOS,
      useExisting: DiscoveryNacos,
    }

    return {
      module: DiscoveryNacosModule,
      providers: [OptionsProvider, DiscoveryNacos, DiscoveryNacosExisting],
      exports: [DiscoveryNacos, DiscoveryNacosExisting],
    }
  }
}
