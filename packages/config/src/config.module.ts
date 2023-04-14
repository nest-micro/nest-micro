import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { CONFIG_OPTIONS } from './config.constants'
import { ConfigOptions } from './config.interface'
import { Config } from './config'
import { ConfigStore } from './config.store'
import { ConfigLoader } from './config.loader'

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options?: ConfigOptions): DynamicModule {
    return this.register(options || {})
  }

  private static register(options: ConfigOptions) {
    const OptionsProvider: Provider = {
      provide: CONFIG_OPTIONS,
      useValue: options,
    }

    const ConfigExisting: Provider = {
      provide: CONFIG,
      useExisting: Config,
    }

    return {
      module: ConfigModule,
      providers: [OptionsProvider, Config, ConfigExisting, ConfigStore, ConfigLoader],
      exports: [Config, ConfigExisting],
    }
  }
}
