import axios from 'axios'
import { concat, assign } from 'lodash'
import { Module, DynamicModule, Global, Provider } from '@nestjs/common'
import { CONFIG, HTTP, CommonModule } from '@nest-micro/common'
import { CONFIG_PREFIX, HTTP_OPTIONS, AXIOS_INSTANCE } from './http.constants'
import { HttpOptions, HttpAsyncOptions } from './interfaces/http.interface'
import { Http } from './http'
import { HttpExplorer } from './http.explorer'
import { HttpOrchestrator } from './http.orchestrator'
import { HttpMetadataAccessor } from './http-metadata.accessor'

@Global()
@Module({
  imports: [CommonModule],
})
export class HttpModule {
  static forRoot(options?: HttpOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: HttpAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: HttpAsyncOptions) {
    const inject = options.inject || []
    const dependencies = options.dependencies || []

    const OptionsProvider: Provider = {
      provide: HTTP_OPTIONS,
      async useFactory(...params: any[]) {
        const config = params[dependencies.indexOf(CONFIG)]
        const configOptions = config?.get(CONFIG_PREFIX)
        const factoryOptions = await options.useFactory?.(params.slice(dependencies.length))
        const assignOptions = assign({}, configOptions, factoryOptions)
        config?.store.set(CONFIG_PREFIX, assignOptions)
        return assignOptions
      },
      inject: concat(dependencies, inject),
    }

    const HttpExisting: Provider = {
      provide: HTTP,
      useExisting: Http,
    }

    const AxiosInstance: Provider = {
      provide: AXIOS_INSTANCE,
      useFactory: () => axios,
    }

    return {
      module: HttpModule,
      providers: [
        OptionsProvider,
        Http,
        HttpExisting,
        AxiosInstance,
        HttpExplorer,
        HttpOrchestrator,
        HttpMetadataAccessor,
      ],
      exports: [Http, HttpExisting],
    }
  }
}
