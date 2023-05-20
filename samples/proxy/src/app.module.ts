import { Module } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { ConfigModule } from '@nest-micro/config'
import { DiscoveryModule } from '@nest-micro/discovery'
import { LoadbalanceModule } from '@nest-micro/loadbalance'
import { ProxyModule } from '@nest-micro/proxy'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiController } from './api.controller'
import { LogWebFilter } from './filters/log-web.filter'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule.forRootAsync({
      dependencies: [CONFIG],
    }),
    LoadbalanceModule.forRootAsync({
      dependencies: [CONFIG],
    }),
    // ProxyModule.forRoot({
    //   extras: {
    //     timeout: 60000,
    //   },
    //   routes: [
    //     {
    //       id: 'github',
    //       uri: 'https://api.github.com',
    //       filters: [
    //         {
    //           name: 'RequestPathFilter',
    //           parameters: {
    //             strip: 2,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: 'app1',
    //       uri: 'http://127.0.0.1:3000',
    //       filters: [
    //         {
    //           name: 'RequestPathFilter',
    //           parameters: {
    //             strip: 2,
    //             // prefix: '',
    //           },
    //         },
    //         {
    //           name: 'RequestHeaderFilter',
    //           parameters: {
    //             authorization: 'Request dGVzdDp0ZXN0',
    //           },
    //         },
    //         {
    //           name: 'ResponseHeaderFilter',
    //           parameters: {
    //             authorization: 'Response dGVzdDp0ZXN0',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: 'app2',
    //       uri: 'lb://app',
    //       filters: [
    //         {
    //           name: 'RequestPathFilter',
    //           parameters: {
    //             strip: 3,
    //             prefix: '/app',
    //           },
    //         },
    //         {
    //           name: 'RequestHeaderFilter',
    //           parameters: {
    //             authorization: 'Request dGVzdDp0ZXN0',
    //           },
    //         },
    //         {
    //           name: 'ResponseHeaderFilter',
    //           parameters: {
    //             authorization: 'Response dGVzdDp0ZXN0',
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // }),
    ProxyModule.forRootAsync({
      dependencies: [CONFIG],
    }),
  ],
  controllers: [AppController, ApiController],
  providers: [AppService, LogWebFilter],
})
export class AppModule {}
