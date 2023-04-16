import { Injectable } from '@nestjs/common'
import { UseInterceptors, HttpInterceptorRegister } from '@nest-micro/http'
import { Log1Interceptor } from './log1.interceptor'

@Injectable()
@UseInterceptors(Log1Interceptor /* ... */)
export class HttpGlobalInterceptorRegister extends HttpInterceptorRegister {}
