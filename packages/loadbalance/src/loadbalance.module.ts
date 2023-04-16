import { concat, assign } from 'lodash'
import { Module, DynamicModule, Global, Provider } from '@nestjs/common'
import { CommonModule, CONFIG, LOADBALANCE } from '@nest-micro/common'
import { CONFIG_PREFIX, LOADBALANCE_OPTIONS } from './loadbalance.constants'
import { LoadbalanceOptions, LoadbalanceAsyncOptions } from './interfaces/loadbalance.interface'
import { Loadbalance } from './loadbalance'
import { LoadbalanceConfig } from './loadbalance.config'
import { LoadbalanceExplorer } from './loadbalance.explorer'
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry'
import { LoadbalanceRuleRegister } from './loadbalance-rule.register'

@Global()
@Module({
  imports: [CommonModule],
})
export class LoadbalanceModule {
  static forRoot(options?: LoadbalanceOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: LoadbalanceAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: LoadbalanceAsyncOptions) {
    const inject = options.inject || []
    const dependencies = options.dependencies || []

    const OptionsProvider: Provider = {
      provide: LOADBALANCE_OPTIONS,
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

    const LoadbalanceExisting: Provider = {
      provide: LOADBALANCE,
      useExisting: Loadbalance,
    }

    return {
      module: LoadbalanceModule,
      providers: [
        OptionsProvider,
        Loadbalance,
        LoadbalanceExisting,
        LoadbalanceConfig,
        LoadbalanceExplorer,
        LoadbalanceRuleRegistry,
        LoadbalanceRuleRegister,
      ],
      exports: [Loadbalance, LoadbalanceExisting, LoadbalanceRuleRegistry],
    }
  }
}
