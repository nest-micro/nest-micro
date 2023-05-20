/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common'
import {
  Get,
  Post,
  Body,
  Query,
  Param,
  Header,
  SetBody,
  SetQuery,
  SetParam,
  SetHeader,
  Response,
  ResponseBody,
  ResponseType,
  ResponseEncode,
  UseInterceptors,
} from '@nest-micro/http'
import { Loadbalanced } from '@nest-micro/loadbalance'
import { Log2Interceptor } from './interceptors/log2.interceptor'
import { Log3Interceptor } from './interceptors/log3.interceptor'

@Injectable()
@Loadbalanced('app')
@UseInterceptors(Log2Interceptor)
export class HttpService {
  @Get('/app')
  @SetQuery('sex', '1')
  @SetParam('name', 'l')
  @ResponseBody()
  @UseInterceptors(new Log3Interceptor())
  getHttp(@Query('sex2') sex: string, @Param('name2') name: string) {}

  @Post('/app')
  @SetBody('sex', '1')
  @SetHeader('name', 'l')
  @Response('data')
  @ResponseType('json')
  @ResponseEncode('utf-8')
  postHttp(@Body('sex2') sex: string, @Header('name2') name: string) {}
}
