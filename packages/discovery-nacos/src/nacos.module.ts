import { Module, DynamicModule, Global } from '@nestjs/common'
import { DiscoveryNacosOptions, DiscoveryNacosAsyncOptions } from './nacos.interface'
import { createOptionsProvider, createAsyncOptionsProvider, createAssignOptionsProvider } from './nacos.provider'
import { DiscoveryNacosService } from './nacos.service'

@Global()
@Module({})
export class DiscoveryNacosModule {
  static forRoot(options?: DiscoveryNacosOptions): DynamicModule {
    const OptionsProvider = createOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    return {
      module: DiscoveryNacosModule,
      providers: [OptionsProvider, OptionsAssignProvider, DiscoveryNacosService],
      exports: [DiscoveryNacosService],
    }
  }

  static forRootAsync(options: DiscoveryNacosAsyncOptions): DynamicModule {
    const OptionsProvider = createAsyncOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    return {
      module: DiscoveryNacosModule,
      providers: [OptionsProvider, OptionsAssignProvider, DiscoveryNacosService],
      exports: [DiscoveryNacosService],
    }
  }
}
