import { concat, assign } from 'lodash'
import { Module, DynamicModule, Global, Provider } from '@nestjs/common'
import { CONFIG, BRAKES } from '@nest-micro/common'
import { CONFIG_PREFIX, BRAKES_OPTIONS } from './brakes.constants'
import { BrakesOptions, BrakesAsyncOptions } from './interfaces/brakes.interface'
import { Brakes } from './brakes'
import { BrakesFactory } from './brakes.factory'
import { BrakesRegistry } from './brakes.registry'

@Global()
@Module({})
export class BrakesModule {
  static forRoot(options?: BrakesOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: BrakesAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: BrakesAsyncOptions) {
    const inject = options.inject || []
    const dependencies = options.dependencies || []

    const OptionsProvider: Provider = {
      provide: BRAKES_OPTIONS,
      async useFactory(...params: any[]) {
        const config = params[dependencies.indexOf(CONFIG)]
        const configOptions = config?.get(CONFIG_PREFIX)
        const factoryOptions = await options.useFactory?.(...params.slice(dependencies.length))
        const assignOptions = assign({}, configOptions, factoryOptions)
        config?.store.set(CONFIG_PREFIX, assignOptions)
        return assignOptions
      },
      inject: concat(dependencies, inject),
    }

    const BrakesExisting: Provider = {
      provide: BRAKES,
      useExisting: Brakes,
    }

    return {
      module: BrakesModule,
      providers: [OptionsProvider, Brakes, BrakesExisting, BrakesFactory, BrakesRegistry],
      exports: [Brakes, BrakesExisting],
    }
  }
}
