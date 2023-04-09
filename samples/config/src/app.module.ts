import * as path from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nest-micro/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    // ConfigModule.forRoot(),
    ConfigModule.forRoot({
      dir: path.resolve(__dirname, '../config'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
