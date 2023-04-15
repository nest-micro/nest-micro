import { Module } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { ConfigModule } from '@nest-micro/config'
import { DiscoveryModule } from '@nest-micro/discovery'
import { LoadbalanceModule } from '@nest-micro/loadbalance'
import { HttpModule } from '@nest-micro/http'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HttpController } from './http.controller'
import { HttpService } from './http.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule.forRootAsync({
      dependencies: [CONFIG],
    }),
    LoadbalanceModule.forRootAsync({
      dependencies: [CONFIG],
    }),
    HttpModule.forRootAsync({
      dependencies: [CONFIG],
    }),
  ],
  controllers: [AppController, HttpController],
  providers: [AppService, HttpService],
})
export class AppModule {}
