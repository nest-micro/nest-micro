import { Injectable } from '@nestjs/common'
import {
  HttpInterceptor,
  // RegisterInterceptor,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from '@nest-micro/http'

@Injectable()
export class Log3Interceptor implements HttpInterceptor {
  onRequest(request: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    console.log('Log3Interceptor onRequest')
    return request
  }

  onRequestError(error: AxiosError): any {
    console.log('Log3Interceptor onRequestError')
    return Promise.reject(error)
  }

  onResponse(response: AxiosResponse): any {
    console.log('Log3Interceptor onResponse')
    return response
  }

  onResponseError(error: AxiosError): any {
    console.log('Log3Interceptor onResponseError')
    return Promise.reject(error)
  }
}
