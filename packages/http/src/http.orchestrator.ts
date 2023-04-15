import { get } from 'lodash'
import { AxiosRequestConfig, AxiosAdapter } from 'axios'
import { Inject, Injectable } from '@nestjs/common'
import { Scanner, BRAKES, LOADBALANCE } from '@nest-micro/common'
import * as uriParams from 'uri-params'
import { HTTP_OPTIONS } from './http.constants'
import { HttpOptions } from './interfaces/http.interface'
import { Interceptor } from './interfaces/interceptor.interface'
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
  AdaptersRefs: AxiosAdapter[]
  InterceptorRefs: Interceptor[]
}

@Injectable()
export class HttpOrchestrator {
  private readonly decoratorRequests: DecoratorRequest[] = []

  constructor(
    private readonly http: Http,
    private readonly scanner: Scanner,
    @Inject(HTTP_OPTIONS) private readonly options: HttpOptions
  ) {}

  addDecoratorRequests(decoratorRequest: DecoratorRequest) {
    this.decoratorRequests.push(decoratorRequest)
  }

  async mountDecoratorRequests() {
    const injectables = await this.scanner.injectables(() => true)
    const brakesProvider = await this.scanner.providers((provider) => provider.name === BRAKES)
    const loadbalanceProvider = await this.scanner.providers((provider) => provider.name === LOADBALANCE)

    this.decoratorRequests.forEach((decoratorRequest) => {
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

      // 获取拦截器
      // 1. 如果当前类被 Nest 管理，则从内部获取实例 => @UseInterceptors(LogInterceptor)
      // 2. 如果当前类不被 Nest 管理，则传入的就是实例 => @UseInterceptors(new LogInterceptor())
      const interceptors: Interceptor[] = []
      for (const interceptor of InterceptorRefs) {
        const injectable = injectables.find((i) => interceptor === i.dependencyType)
        if (injectable) {
          interceptors.push(injectable.instance)
        } else {
          interceptors.push(interceptor)
        }
      }

      const http = this.http.create(this.options)
      http.useBrakes(brakesProvider[0]?.instance)
      http.useLoadbalance(loadbalanceProvider[0]?.instance, loadbalanceService)
      http.useInterceptors(...interceptors)

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
    })
  }
}
