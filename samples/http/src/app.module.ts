import { Module } from '@nestjs/common'
import { ConfigModule } from '@nest-micro/config'
import { HttpModule } from '@nest-micro/http'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HttpController } from './http.controller'
import { HttpService } from './http.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.forRoot({
      axios: {
        timeout: 1000,
        baseURL: 'http://127.0.0.1:3000',
      },
    }),
  ],
  controllers: [AppController, HttpController],
  providers: [AppService, HttpService],
})
export class AppModule {}
