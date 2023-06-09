import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { HTTP_OPTIONS } from './http.constants'
import { HttpOptions } from './interfaces/http.interface'
import { HttpInterceptor } from './interfaces/interceptor.interface'

@Injectable()
export class Http {
  private http!: AxiosInstance
  private interceptors: HttpInterceptor[] = []
  private brakes: any
  private brakesFallback: any
  private loadbalance: any
  private loadbalanceService: any

  constructor(@Inject(HTTP_OPTIONS) private readonly options: HttpOptions) {
    this.http = axios.create(this.options.axios || {})
  }

  /**
   * 创建新请求实例
   * @param options
   * @returns
   */
  create(options: HttpOptions = {}) {
    return new Http(options)
  }

  /**
   * 使用断路由器
   * @param brakes
   * @param fallback
   */
  useBrakes(brakes: any, fallback?: any) {
    this.brakes = brakes
    this.brakesFallback = fallback
  }

  /**
   * 使用负载均衡
   * @param loadbalance
   * @param service
   * @returns
   */
  useLoadbalance(loadbalance: any, service?: any) {
    this.loadbalance = loadbalance
    this.loadbalanceService = service
    return this
  }

  /**
   * 使用拦截器
   * @param interceptors
   * @returns
   */
  useInterceptors(...interceptors: HttpInterceptor[]) {
    this.interceptors = interceptors
    this.setupInterceptors()
    return this
  }

  /**
   * 发起请求
   * @param options
   * @returns
   */
  async request(options: AxiosRequestConfig): Promise<AxiosResponse | any> {
    return this.doRequest(options)
  }

  private async doRequest(options: AxiosRequestConfig): Promise<AxiosResponse | any> {
    if (this.loadbalance && this.loadbalanceService) {
      const server = this.loadbalance.choose(this.loadbalanceService)
      if (!server) {
        throw new InternalServerErrorException(`No available server can handle this request`)
      }
      options.baseURL = `http://${server.ip}:${server.port}`
    }

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
