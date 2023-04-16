import { get } from 'lodash'
import { AxiosRequestConfig } from 'axios'
import { Inject, Injectable } from '@nestjs/common'
import { Scanner, BRAKES, LOADBALANCE } from '@nest-micro/common'
import * as uriParams from 'uri-params'
import { HTTP_OPTIONS } from './http.constants'
import { HttpOptions } from './interfaces/http.interface'
import { HttpInterceptor } from './interfaces/interceptor.interface'
import { ParamsMetadata } from './interfaces/params-metadata.interface'
import { getRequestParams } from './utils/params.util'
import { Http } from './http'

interface DecoratorRequest {
  instance: Function
  methodName: string
  options: AxiosRequestConfig
  paramsMetadata: ParamsMetadata
  responseField: string
  loadbalanceService: string
  AdaptersRefs: Function[]
  InterceptorRefs: Function[]
}

@Injectable()
export class HttpOrchestrator {
  private readonly decoratorRequests: DecoratorRequest[] = []
  private readonly globalInterceptorRefs: Function[] = []

  constructor(
    private readonly http: Http,
    private readonly scanner: Scanner,
    @Inject(HTTP_OPTIONS) private readonly options: HttpOptions
  ) {}

  addDecoratorRequests(decoratorRequest: DecoratorRequest) {
    this.decoratorRequests.push(decoratorRequest)
  }

  addGlobalInterceptors(interceptors: Function[]) {
    this.globalInterceptorRefs.push(...interceptors)
  }

  async mountDecoratorRequests() {
    const brakes = (await this.scanner.providers((provider) => provider.name === BRAKES))[0]?.instance
    const loadbalance = (await this.scanner.providers((provider) => provider.name === LOADBALANCE))[0]?.instance

    for (const decoratorRequest of this.decoratorRequests) {
      const {
        instance,
        methodName,
        options,
        paramsMetadata,
        responseField,
        loadbalanceService,
        // AdaptersRefs,
        InterceptorRefs,
      } = decoratorRequest

      const globalInterceptors = this.globalInterceptorRefs as HttpInterceptor[]
      const scopeInterceptors = await this.scanner.injectablesInstanceWithDependencys<HttpInterceptor>(InterceptorRefs)

      const http = this.http.create(this.options)
      http.useBrakes(brakes)
      http.useLoadbalance(loadbalance, loadbalanceService)
      http.useInterceptors(...globalInterceptors, ...scopeInterceptors)

      // 重写实例方法，真正调用的是此函数
      // @ts-expect-error
      instance[methodName] = async (...params: any[]) => {
        const requestParams = getRequestParams(paramsMetadata, params)
        const requestOptions = {
          ...options,
          params: requestParams.params,
          data: requestParams.data,
          headers: requestParams.headers,
          url: uriParams(options.url, requestParams.uriParams),
        } as AxiosRequestConfig

        const response = await http.request(requestOptions)
        if (responseField) {
          return get(response, responseField)
        } else {
          return response
        }
      }
    }
  }
}
