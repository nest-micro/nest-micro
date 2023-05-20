import { concat, assign } from 'lodash'
import { Module, DynamicModule, Global, Provider } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { CONFIG_PREFIX, NACOS_CONFIG_OPTIONS } from './nacos-config.constants'
import { NacosConfigOptions, NacosConfigAsyncOptions } from './nacos-config.interface'
import { createNacosConfig, createNacosConfigExisting } from './nacos-config'

@Global()
@Module({})
export class NacosConfigModule {
  static forRoot(options?: NacosConfigOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
      dependencies: [CONFIG],
    })
  }

  static forRootAsync(options: NacosConfigAsyncOptions): DynamicModule {
    return this.register({
      ...options,
      dependencies: [CONFIG],
    })
  }

  private static register(options: NacosConfigAsyncOptions) {
    const inject = options.inject || []
    const dependencies = options.dependencies || []

    const OptionsProvider: Provider = {
      provide: NACOS_CONFIG_OPTIONS,
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

    const NacosConfig = createNacosConfig()
    const NacosConfigExisting = createNacosConfigExisting()

    return {
      module: NacosConfigModule,
      providers: [OptionsProvider, NacosConfig, NacosConfigExisting],
      exports: [NacosConfig, NacosConfigExisting],
    }
  }
}
