import { Module } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { ConfigModule } from '@nest-micro/config'
import { DiscoveryModule } from '@nest-micro/discovery'
import { DiscoveryNacosModule } from '@nest-micro/discovery-nacos'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule.forRoot(),
    // DiscoveryNacosModule.forRoot({
    //   // logger: false,
    //   client: {
    //     serverList: '127.0.0.1:8848',
    //     namespace: '5f8d158f-c2b0-4d12-bc8b-03496d993dfb',
    //   },
    //   instance: {
    //     // ip: '127.0.0.1',
    //     port: 3000,
    //     serviceName: 'discovery',
    //     metadata: {
    //       version: process.version,
    //     },
    //   },
    //   subscribes: [
    //     {
    //       serviceName: 'discovery',
    //     },
    //     {
    //       serviceName: 'discovery-nacos',
    //     },
    //   ],
    // }),
    DiscoveryNacosModule.forRootAsync({
      dependencies: [CONFIG],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
