import { Injectable } from '@nestjs/common'
import { HttpInterceptor } from '@nest-micro/http'

@Injectable()
export class Log2Interceptor implements HttpInterceptor {
  onRequest(request: any): any {
    console.log('Log2Interceptor onRequest')
    return request
  }

  onRequestError(error: any): any {
    console.log('Log2Interceptor onRequestError')
    return Promise.reject(error)
  }

  onResponse(response: any): any {
    console.log('Log2Interceptor onResponse')
    return response
  }

  onResponseError(error: any): any {
    console.log('Log2Interceptor onResponseError')
    return Promise.reject(error)
  }
}
