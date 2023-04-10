import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { CONFIG_OPTIONS } from './config.constants'
import { ConfigOptions } from './config.interface'
import { Config } from './config'
import { ConfigStore } from './config.store'
import { ConfigLoader } from './config.loader'

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options?: ConfigOptions): DynamicModule {
    const OptionsProvider: Provider = {
      provide: CONFIG_OPTIONS,
      useValue: options || {},
    }

    return {
      module: ConfigModule,
      providers: [OptionsProvider, Config, ConfigStore, ConfigLoader],
      exports: [Config, ConfigStore],
    }
  }
}
