import { Controller, Get } from '@nestjs/common'
import { HttpService } from './http.service'

@Controller('/http')
export class HttpController {
  constructor(private readonly httpService: HttpService) {}

  @Get('get')
  getHttp() {
    return this.httpService.getHttp('2', 'h')
  }

  @Get('post')
  postHttp() {
    return this.httpService.postHttp('2', 'h')
  }
}
