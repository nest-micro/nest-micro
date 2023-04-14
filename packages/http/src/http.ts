import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { Inject, Injectable } from '@nestjs/common'
import { HTTP_OPTIONS } from './http.constants'
import { HttpOptions } from './interfaces/http.interface'
import { Interceptor } from './interfaces/interceptor.interface'

@Injectable()
export class Http {
  private http!: AxiosInstance
  private interceptors: Interceptor[] = []
  private brakes: any
  private fallback: any
  private loadbalance: any

  constructor(@Inject(HTTP_OPTIONS) private readonly options: HttpOptions) {
    this.http = axios.create(this.options.axios || {})
  }

  create(options: HttpOptions = {}) {
    return new Http(options)
  }

  useBrakes(brakes: any, fallback?: any) {
    this.brakes = brakes
    this.fallback = fallback
  }

  useLoadbalance(loadbalance: any) {
    this.loadbalance = loadbalance
    return this
  }

  useInterceptors(...interceptors: Interceptor[]) {
    this.interceptors = interceptors
    this.setupInterceptors()
    return this
  }

  request(options: AxiosRequestConfig): Promise<AxiosResponse | any> {
    return this.http.request(options)
  }

  private setupInterceptors() {
    this.interceptors.forEach((interceptor) => {
      this.http.interceptors.request.use(
        interceptor.onRequest ? interceptor.onRequest.bind(interceptor) : undefined,
        interceptor.onRequestError ? interceptor.onRequestError.bind(interceptor) : undefined
      )
      this.http.interceptors.response.use(
        interceptor.onResponse ? interceptor.onResponse.bind(interceptor) : undefined,
        interceptor.onResponseError ? interceptor.onResponseError.bind(interceptor) : undefined
      )
    })
  }
}
