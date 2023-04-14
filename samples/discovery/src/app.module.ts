import { Module } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { ConfigModule } from '@nest-micro/config'
import { DiscoveryModule } from '@nest-micro/discovery'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    // DiscoveryModule.forRoot({
    //   services: [
    //     {
    //       name: 'app1',
    //       servers: [
    //         { id: '1#3000', ip: '127.0.0.1', port: 3000 },
    //         { id: '1#4000', ip: '127.0.0.1', port: 4000 },
    //       ],
    //     },
    //     {
    //       name: 'app2',
    //       servers: [
    //         { id: '1#5000', ip: '127.0.0.1', port: 5000 },
    //         { id: '1#6000', ip: '127.0.0.1', port: 6000 },
    //       ],
    //     },
    //   ],
    // }),
    DiscoveryModule.forRootAsync({
      dependencies: [CONFIG],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
