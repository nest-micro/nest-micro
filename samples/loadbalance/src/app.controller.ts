import { Controller, Get, Param } from '@nestjs/common'
import { DiscoveryClient } from '@nest-micro/discovery'
import { Loadbalance } from '@nest-micro/loadbalance'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly discoveryClient: DiscoveryClient,
    private readonly loadbalance: Loadbalance
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/getServices')
  getServices() {
    return this.discoveryClient.getServices()
  }

  @Get('/chooseServer/:name')
  chooseServer(@Param('name') name: string) {
    return this.loadbalance.choose(name)
  }
}
