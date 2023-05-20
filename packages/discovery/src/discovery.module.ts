import { concat, assign } from 'lodash'
import { Module, DynamicModule, Global, Provider } from '@nestjs/common'
import { CONFIG, DISCOVERY } from '@nest-micro/common'
import { CONFIG_PREFIX, DISCOVERY_OPTIONS } from './discovery.constants'
import { DiscoveryOptions, DiscoveryAsyncOptions } from './discovery.interface'
import { DiscoveryClient } from './discovery-client'

@Global()
@Module({})
export class DiscoveryModule {
  static forRoot(options?: DiscoveryOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: DiscoveryAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: DiscoveryAsyncOptions) {
    const inject = options.inject || []
    const dependencies = options.dependencies || []

    const OptionsProvider: Provider = {
      provide: DISCOVERY_OPTIONS,
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

    const DiscoveryExisting: Provider = {
      provide: DISCOVERY,
      useExisting: DiscoveryClient,
    }

    return {
      module: DiscoveryModule,
      providers: [OptionsProvider, DiscoveryClient, DiscoveryExisting],
      exports: [DiscoveryClient, DiscoveryExisting],
    }
  }
}
