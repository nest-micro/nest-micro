import { Injectable } from '@nestjs/common'
import {
  HttpInterceptor,
  RegisterInterceptor,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from '@nest-micro/http'

@Injectable()
@RegisterInterceptor()
export class Log1Interceptor implements HttpInterceptor {
  onRequest(request: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    console.log('Log1Interceptor onRequest')
    return request
  }

  onRequestError(error: AxiosError): any {
    console.log('Log1Interceptor onRequestError')
    return Promise.reject(error)
  }

  onResponse(response: AxiosResponse): any {
    console.log('Log1Interceptor onResponse')
    return response
  }

  onResponseError(error: AxiosError): any {
    console.log('Log1Interceptor onResponseError')
    return Promise.reject(error)
  }
}
