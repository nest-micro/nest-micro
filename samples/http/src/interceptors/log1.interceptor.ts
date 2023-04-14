import { Injectable } from '@nestjs/common'
import { Interceptor } from '@nest-micro/http'

@Injectable()
export class Log1Interceptor implements Interceptor {
  onRequest(request: any): any {
    console.log('Log1Interceptor onRequest')
    return request
  }

  onRequestError(error: any): any {
    console.log('Log1Interceptor onRequestError')
    return Promise.reject(error)
  }

  onResponse(response: any): any {
    console.log('Log1Interceptor onResponse')
    return response
  }

  onResponseError(error: any): any {
    console.log('Log1Interceptor onResponseError')
    return Promise.reject(error)
  }
}
