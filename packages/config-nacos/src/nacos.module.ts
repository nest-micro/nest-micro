import { Module, DynamicModule, Global } from '@nestjs/common'
import { ConfigNacosOptions, ConfigNacosAsyncOptions } from './nacos.interface'
import { createOptionsProvider, createAsyncOptionsProvider, createAssignOptionsProvider } from './nacos.provider'
import { createConfigNacosService } from './nacos.service'

@Global()
@Module({})
export class ConfigNacosModule {
  static forRoot(options?: ConfigNacosOptions): DynamicModule {
    const OptionsProvider = createOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    const ConfigNacosService = createConfigNacosService()
    return {
      module: ConfigNacosModule,
      providers: [OptionsProvider, OptionsAssignProvider, ConfigNacosService],
      exports: [ConfigNacosService],
    }
  }

  static forRootAsync(options: ConfigNacosAsyncOptions): DynamicModule {
    const OptionsProvider = createAsyncOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    const ConfigNacosService = createConfigNacosService()
    return {
      module: ConfigNacosModule,
      providers: [OptionsProvider, OptionsAssignProvider, ConfigNacosService],
      exports: [ConfigNacosService],
    }
  }
}
