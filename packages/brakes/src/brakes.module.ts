import { Module, DynamicModule, Global } from '@nestjs/common'
import { BrakesOptions, BrakesAsyncOptions } from './interfaces/brakes.interface'
import { createOptionsProvider, createAsyncOptionsProvider, createAssignOptionsProvider } from './brakes.provider'
import { Brakes } from './brakes'
import { BrakesFactory } from './brakes.factory'
import { BrakesRegistry } from './brakes.registry'

@Global()
@Module({})
export class BrakesModule {
  static forRoot(options?: BrakesOptions): DynamicModule {
    const OptionsProvider = createOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    return {
      module: BrakesModule,
      providers: [OptionsProvider, OptionsAssignProvider, Brakes, BrakesFactory, BrakesRegistry],
      exports: [Brakes],
    }
  }

  static forRootAsync(options: BrakesAsyncOptions): DynamicModule {
    const OptionsProvider = createAsyncOptionsProvider(options)
    const OptionsAssignProvider = createAssignOptionsProvider()
    return {
      module: BrakesModule,
      providers: [OptionsProvider, OptionsAssignProvider, Brakes, BrakesFactory, BrakesRegistry],
      exports: [Brakes],
    }
  }
}
