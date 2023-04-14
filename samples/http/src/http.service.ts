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
  // UseAdapters,
  UseInterceptors,
} from '@nest-micro/http'
import { Log1Interceptor } from './interceptors/log1.interceptor'
import { Log2Interceptor } from './interceptors/log2.interceptor'

@Response()
// @UseAdapters()
@UseInterceptors(Log1Interceptor)
@Injectable()
export class HttpService {
  @Get('/app')
  @SetQuery('sex', '1')
  @SetParam('name', 'l')
  @ResponseBody()
  // @UseAdapters()
  @UseInterceptors(new Log2Interceptor())
  getHttp(@Query('sex2') sex: string, @Param('name2') name: string) {}

  @Post('/app')
  @SetBody('sex', '1')
  @SetHeader('name', 'l')
  @Response('data')
  @ResponseType('json')
  @ResponseEncode('utf-8')
  postHttp(@Body('sex2') sex: string, @Header('name2') name: string) {}
}
