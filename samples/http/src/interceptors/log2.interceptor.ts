import { Injectable } from '@nestjs/common'
import {
  HttpInterceptor,
  // RegisterInterceptor,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from '@nest-micro/http'

@Injectable()
export class Log2Interceptor implements HttpInterceptor {
  onRequest(request: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    console.log('Log2Interceptor onRequest')
    return request
  }

  onRequestError(error: AxiosError): any {
    console.log('Log2Interceptor onRequestError')
    return Promise.reject(error)
  }

  onResponse(response: AxiosResponse): any {
    console.log('Log2Interceptor onResponse')
    return response
  }

  onResponseError(error: AxiosError): any {
    console.log('Log2Interceptor onResponseError')
    return Promise.reject(error)
  }
}
