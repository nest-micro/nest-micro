import { concat, assign } from 'lodash'
import { Module, DynamicModule, Global, Provider } from '@nestjs/common'
import { CommonModule, CONFIG, PROXY } from '@nest-micro/common'
import { CONFIG_PREFIX, PROXY_OPTIONS } from './proxy.constants'
import { ProxyOptions, ProxyAsyncOptions } from './interfaces/proxy.interface'
import { Proxy } from './proxy'
import { ProxyConfig } from './proxy.config'
import { ProxyExplorer } from './proxy.explorer'
import { ProxyRouteRegistry } from './proxy-route.registry'
import { ProxyFilterRegistry } from './proxy-filter.registry'
import { ProxyFilterRegister } from './proxy-filter.register'

@Global()
@Module({
  imports: [CommonModule],
})
export class ProxyModule {
  static forRoot(options?: ProxyOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: ProxyAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: ProxyAsyncOptions) {
    const inject = options.inject || []
    const dependencies = options.dependencies || []

    const OptionsProvider: Provider = {
      provide: PROXY_OPTIONS,
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

    const ProxyExisting: Provider = {
      provide: PROXY,
      useExisting: Proxy,
    }

    return {
      module: ProxyModule,
      providers: [
        OptionsProvider,
        Proxy,
        ProxyExisting,
        ProxyConfig,
        ProxyExplorer,
        ProxyRouteRegistry,
        ProxyFilterRegistry,
        ...ProxyFilterRegister,
      ],
      exports: [Proxy, ProxyExisting],
    }
  }
}
