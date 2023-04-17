import { Controller, Get, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { AppService } from './app.service'

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: Request): string {
    console.log(req.headers.authorization)
    return this.appService.getHello()
  }

  @Post()
  postHello(@Req() req: Request): string {
    console.log(req.headers.authorization)
    return this.appService.postHello()
  }
}
