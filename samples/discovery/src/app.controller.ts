import { Controller, Get, Param } from '@nestjs/common'
import { Discovery } from '@nest-micro/discovery'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly discovery: Discovery) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/getServices')
  getServices() {
    return this.discovery.getServices()
  }

  @Get('/getServiceNames')
  getServiceNames() {
    return this.discovery.getServiceNames()
  }

  @Get('/getServiceServers/:name')
  getServiceServers(@Param('name') name: string) {
    return this.discovery.getServiceServers(name)
  }

  @Get('/setServiceServers/:name')
  setServiceServers(@Param('name') name: string) {
    this.discovery.setServiceServers(name, [
      { id: '1#7000', ip: '127.0.0.1', port: 7000 },
      { id: '1#8000', ip: '127.0.0.1', port: 8000 },
    ])
  }
}
