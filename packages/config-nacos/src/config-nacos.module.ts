import { Module, DynamicModule, Global } from '@nestjs/common'
import { ConfigNacosOptions, ConfigNacosAsyncOptions } from './config-nacos.interface'
import { createOptionsProvider, createAsyncOptionsProvider, createAssignOptionsProvider } from './config-nacos.provider'
import { createConfigNacos } from './config-nacos'

@Global()
@Module({})
export class ConfigNacosModule {
  static forRoot(options?: ConfigNacosOptions): DynamicModule {
    const OptionsProvider = createOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    const ConfigNacos = createConfigNacos()
    return {
      module: ConfigNacosModule,
      providers: [OptionsProvider, OptionsAssignProvider, ConfigNacos],
      exports: [ConfigNacos],
    }
  }

  static forRootAsync(options: ConfigNacosAsyncOptions): DynamicModule {
    const OptionsProvider = createAsyncOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    const ConfigNacos = createConfigNacos()
    return {
      module: ConfigNacosModule,
      providers: [OptionsProvider, OptionsAssignProvider, ConfigNacos],
      exports: [ConfigNacos],
    }
  }
}
