import { Controller, Get, Param } from '@nestjs/common'
import { DiscoveryService } from '@nest-micro/discovery'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly discoveryService: DiscoveryService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/getServices')
  getConfig() {
    return this.discoveryService.getServices()
  }

  @Get('/getServiceNames')
  getConfigKey() {
    return this.discoveryService.getServiceNames()
  }

  @Get('/getServiceServers/:name')
  getServiceServers(@Param('name') name: string) {
    return this.discoveryService.getServiceServers(name)
  }
}
