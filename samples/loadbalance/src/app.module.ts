import { Module } from '@nestjs/common'
import { ConfigModule } from '@nest-micro/config'
import { DiscoveryModule } from '@nest-micro/discovery'
import { LoadbalanceModule } from '@nest-micro/loadbalance'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule.forRoot(),
    LoadbalanceModule.forRoot(),
    // LoadbalanceModule.forRoot({
    //   rule: 'RandomRule',
    //   services: [
    //     {
    //       name: 'app2',
    //       rule: 'RoundRobinRule',
    //     },
    //   ],
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
