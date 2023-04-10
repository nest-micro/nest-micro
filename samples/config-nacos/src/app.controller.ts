import { Controller, Get, Param } from '@nestjs/common'
import { Config } from '@nest-micro/config'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly config: Config) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/config')
  getConfig() {
    return this.config.get()
  }

  @Get('/config/:key')
  getConfigKey(@Param('key') key: string) {
    return this.config.get(key)
  }
}
