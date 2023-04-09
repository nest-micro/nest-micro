import { Module, DynamicModule, Global } from '@nestjs/common'
import { DiscoveryOptions, DiscoveryAsyncOptions } from './discovery.interface'
import { createOptionsProvider, createAsyncOptionsProvider, createAssignOptionsProvider } from './discovery.provider'
import { DiscoveryService } from './discovery.service'

@Global()
@Module({})
export class DiscoveryModule {
  static forRoot(options?: DiscoveryOptions): DynamicModule {
    const OptionsProvider = createOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    return {
      module: DiscoveryModule,
      providers: [OptionsProvider, OptionsAssignProvider, DiscoveryService],
      exports: [DiscoveryService],
    }
  }

  static forRootAsync(options: DiscoveryAsyncOptions): DynamicModule {
    const OptionsProvider = createAsyncOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    return {
      module: DiscoveryModule,
      providers: [OptionsProvider, OptionsAssignProvider, DiscoveryService],
      exports: [DiscoveryService],
    }
  }
}
