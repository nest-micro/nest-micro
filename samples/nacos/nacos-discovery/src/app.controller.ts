import { Controller, Get, Param } from '@nestjs/common'
import { DiscoveryClient } from '@nest-micro/discovery'
import { NacosDiscovery } from '@nest-micro/nacos-discovery'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly discoveryClient: DiscoveryClient,
    private readonly nacosDiscovery: NacosDiscovery
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/getServices')
  getServices() {
    return this.discoveryClient.getServices()
  }

  @Get('/getServiceNames')
  getServiceNames() {
    return this.discoveryClient.getServiceNames()
  }

  @Get('/getServiceServers/:name')
  getServiceServers(@Param('name') name: string) {
    return this.nacosDiscovery.getAllInstances(name)
  }

  @Get('/setServiceServers/:name')
  async setServiceServers(@Param('name') name: string) {
    await this.nacosDiscovery.registerInstance({
      serviceName: name,
      ip: '127.0.0.1',
      port: 3000,
      metadata: {
        version: process.version,
      },
    })
  }
}
