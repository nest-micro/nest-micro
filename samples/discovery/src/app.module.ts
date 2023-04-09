import { Module } from '@nestjs/common'
import { ConfigModule } from '@nest-micro/config'
import { DiscoveryModule } from '@nest-micro/discovery'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule.forRoot(),
    // DiscoveryModule.forRoot({
    //   services: [
    //     {
    //       name: 'app1',
    //       servers: [
    //         { ip: '127.0.0.1', port: 3000 },
    //         { ip: '127.0.0.1', port: 4000 },
    //       ],
    //     },
    //     {
    //       name: 'app2',
    //       servers: [
    //         { ip: '127.0.0.1', port: 5000 },
    //         { ip: '127.0.0.1', port: 6000 },
    //       ],
    //     },
    //   ],
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
