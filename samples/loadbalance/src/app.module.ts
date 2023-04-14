import { Module } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { ConfigModule } from '@nest-micro/config'
import { DiscoveryModule } from '@nest-micro/discovery'
import { LoadbalanceModule } from '@nest-micro/loadbalance'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule.forRootAsync({
      dependencies: [CONFIG],
    }),
    // LoadbalanceModule.forRoot({
    //   rule: 'RandomRule',
    //   services: [
    //     {
    //       name: 'app2',
    //       rule: 'RoundRobinRule',
    //     },
    //   ],
    // }),
    LoadbalanceModule.forRootAsync({
      dependencies: [CONFIG],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
