# Nacos Config

用于从 Nacos 配置中心中获取配置。

它的目的是用来对应类似 [Spring Cloud Alibaba](https://spring.io/projects/spring-cloud-alibaba) 分布式配置的功能。

::: tip
此模块是作为 `config` 模块的扩展功能。

它读取的配置会由 `config` 模块管理，所以你可以使用 `config` 中的所有功能。
:::

## 安装

依赖 [Config](../config.md) 模块。

```bash
npm install --save @nest-micro/config
npm install --save @nest-micro/nacos-config
```

## 开始

[示例应用](https://github.com/nest-micro/nest-micro/tree/main/samples/nacos/nacos-config)

### 导入模块

```ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nest-micro/config'
import { NacosConfigModule } from '@nest-micro/nacos-config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    NacosConfigModule.forRoot({
      client: {
        serverAddr: '127.0.0.1:8848',
        namespace: '5f8d158f-c2b0-4d12-bc8b-03496d993dfb',
      },
      configs: {
        dataId: 'config.development.yaml',
        group: 'development',
      },
      sharedConfigs: {
        dataId: 'config.yaml',
        group: 'DEFAULT_GROUP',
      },
    }),
    // NacosConfigModule.forRootAsync({
    //   useFactory() {
    //     return {
    //       // async options
    //     }
    //   },
    // }),
  ],
})
export class AppModule {}
```

### 配置文件

由于依赖 [Config](../config.md) 模块，可自动从配置文件中读取配置。

```yaml
nacos:
  config:
    client:
      serverAddr: 127.0.0.1:8848
      namespace: 5f8d158f-c2b0-4d12-bc8b-03496d993dfb
    configs:
      dataId: config.development.yaml
      group: development
    sharedConfigs:
      dataId: config.yaml
      group: DEFAULT_GROUP
```

## 使用

### 注入实例

```ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { NacosConfig } from '@nest-micro/nacos-config'

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly config: NacosConfig) {}

  onModuleInit() {
    this.config.get()
    this.config.get<number>('service.port')
    this.config.get<number>('service.port', 3000)
  }
}
```

## API

[NacosConfig API](https://github.com/nest-micro/nest-micro/blob/main/packages/nacos/nacos-config/src/nacos-config.ts)
