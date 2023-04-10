import { Module, DynamicModule, Global } from '@nestjs/common'
import { LoadbalanceOptions, LoadbalanceAsyncOptions } from './interfaces'
import { createOptionsProvider, createAsyncOptionsProvider, createAssignOptionsProvider } from './loadbalance.provider'
import { Loadbalance } from './loadbalance'
import { LoadbalanceConfig } from './loadbalance.config'
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry'
import { LoadbalanceRuleRegister } from './loadbalance-rule.register'

@Global()
@Module({})
export class LoadbalanceModule {
  static forRoot(options?: LoadbalanceOptions): DynamicModule {
    const OptionsProvider = createOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    return {
      module: LoadbalanceModule,
      providers: [
        OptionsProvider,
        OptionsAssignProvider,
        Loadbalance,
        LoadbalanceConfig,
        LoadbalanceRuleRegistry,
        LoadbalanceRuleRegister,
      ],
      exports: [Loadbalance, LoadbalanceRuleRegistry],
    }
  }

  static forRootAsync(options: LoadbalanceAsyncOptions): DynamicModule {
    const OptionsProvider = createAsyncOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    return {
      module: LoadbalanceModule,
      providers: [
        OptionsProvider,
        OptionsAssignProvider,
        Loadbalance,
        LoadbalanceConfig,
        LoadbalanceRuleRegistry,
        LoadbalanceRuleRegister,
      ],
      exports: [Loadbalance, LoadbalanceRuleRegistry],
    }
  }
}
