import { Module } from '@nestjs/common'
import { ConfigModule } from '@nest-micro/config'
import { ConfigNacosModule } from '@nest-micro/config-nacos'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigNacosModule.forRoot(),
    // ConfigNacosModule.forRoot({
    //   client: {
    //     serverAddr: '127.0.0.1:8848',
    //     namespace: '5f8d158f-c2b0-4d12-bc8b-03496d993dfb',
    //   },
    //   configs: {
    //     dataId: 'config.development.yaml',
    //     group: 'development',
    //   },
    //   sharedConfigs: {
    //     dataId: 'config.yaml',
    //     group: 'DEFAULT_GROUP',
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
