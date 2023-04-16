import { Injectable } from '@nestjs/common'
import { HttpInterceptor } from '@nest-micro/http'

@Injectable()
export class Log3Interceptor implements HttpInterceptor {
  onRequest(request: any): any {
    console.log('Log3Interceptor onRequest')
    return request
  }

  onRequestError(error: any): any {
    console.log('Log3Interceptor onRequestError')
    return Promise.reject(error)
  }

  onResponse(response: any): any {
    console.log('Log3Interceptor onResponse')
    return response
  }

  onResponseError(error: any): any {
    console.log('Log3Interceptor onResponseError')
    return Promise.reject(error)
  }
}
