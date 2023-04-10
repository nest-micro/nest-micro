import { Module, DynamicModule, Global } from '@nestjs/common'
import { DiscoveryNacosOptions, DiscoveryNacosAsyncOptions } from './discovery-nacos.interface'
import {
  createOptionsProvider,
  createAsyncOptionsProvider,
  createAssignOptionsProvider,
} from './discovery-nacos.provider'
import { DiscoveryNacos } from './discovery-nacos'

@Global()
@Module({})
export class DiscoveryNacosModule {
  static forRoot(options?: DiscoveryNacosOptions): DynamicModule {
    const OptionsProvider = createOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    return {
      module: DiscoveryNacosModule,
      providers: [OptionsProvider, OptionsAssignProvider, DiscoveryNacos],
      exports: [DiscoveryNacos],
    }
  }

  static forRootAsync(options: DiscoveryNacosAsyncOptions): DynamicModule {
    const OptionsProvider = createAsyncOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    return {
      module: DiscoveryNacosModule,
      providers: [OptionsProvider, OptionsAssignProvider, DiscoveryNacos],
      exports: [DiscoveryNacos],
    }
  }
}
