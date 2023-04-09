import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { CONFIG_OPTIONS } from './config.constants'
import { ConfigOptions } from './config.interface'
import { ConfigStore } from './config.store'
import { ConfigLoader } from './config.loader'
import { ConfigService } from './config.service'

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
      providers: [OptionsProvider, ConfigStore, ConfigLoader, ConfigService],
      exports: [ConfigStore, ConfigService],
    }
  }
}
