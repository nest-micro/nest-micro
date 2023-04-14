import { concat, assign } from 'lodash'
import { Module, DynamicModule, Global, Provider } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { CONFIG_PREFIX, CONFIG_NACOS_OPTIONS } from './config-nacos.constants'
import { ConfigNacosOptions, ConfigNacosAsyncOptions } from './config-nacos.interface'
import { createConfigNacos, createConfigNacosExisting } from './config-nacos'

@Global()
@Module({})
export class ConfigNacosModule {
  static forRoot(options?: ConfigNacosOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
      dependencies: [CONFIG],
    })
  }

  static forRootAsync(options: ConfigNacosAsyncOptions): DynamicModule {
    return this.register({
      ...options,
      dependencies: [CONFIG],
    })
  }

  private static register(options: ConfigNacosAsyncOptions) {
    const inject = options.inject || []
    const dependencies = options.dependencies || []

    const OptionsProvider: Provider = {
      provide: CONFIG_NACOS_OPTIONS,
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

    const ConfigNacos = createConfigNacos()
    const ConfigNacosExisting = createConfigNacosExisting()

    return {
      module: ConfigNacosModule,
      providers: [OptionsProvider, ConfigNacos, ConfigNacosExisting],
      exports: [ConfigNacos, ConfigNacosExisting],
    }
  }
}
