import { Module } from '@nestjs/common'
import { ConfigModule } from '@nest-micro/config'
import { BrakesModule } from '@nest-micro/brakes'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    BrakesModule.forRoot(),
    // BrakesModule.forRoot({
    //   timeout: 20000,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
