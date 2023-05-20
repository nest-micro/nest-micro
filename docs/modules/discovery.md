# Discovery

用于管理服务注册和服务发现。

它的目的是用来对应类似 [Spring Cloud Commons](https://spring.io/projects/spring-cloud-commons) DiscoveryClient / ServiceRegistry 的功能。

## 安装

```bash
npm install --save @nest-micro/discovery
```

## 开始

[示例应用](https://github.com/nest-micro/nest-micro/tree/main/samples/discovery)

### 导入模块

```ts
import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nest-micro/discovery'

@Module({
  imports: [
    DiscoveryModule.forRoot({
      services: [
        {
          name: 'app1',
          servers: [
            { id: '1#3000', ip: '127.0.0.1', port: 3000 },
            { id: '1#4000', ip: '127.0.0.1', port: 4000 },
          ],
        },
        {
          name: 'app2',
          servers: [
            { id: '1#5000', ip: '127.0.0.1', port: 5000 },
            { id: '1#6000', ip: '127.0.0.1', port: 6000 },
          ],
        },
      ],
    }),
    // DiscoveryModule.forRootAsync({
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

如果使用了 [Config](./config.md) 模块。指定 `dependencies` 依赖，可自动从配置文件中读取配置。

```ts {2,3,8,10}
import { Module } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { ConfigModule } from '@nest-micro/config'
import { DiscoveryModule } from '@nest-micro/discovery'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule.forRootAsync({
      dependencies: [CONFIG],
    }),
  ],
})
export class AppModule {}
```

```yaml
discovery:
  services:
    - name: app1
      servers:
        - id: 1#3000
          ip: 127.0.0.1
          port: 3000
        - id: 1#4000
          ip: 127.0.0.1
          port: 4000
    - name: app2
      servers:
        - id: 1#5000
          ip: 127.0.0.1
          port: 5000
        - id: 1#6000
          ip: 127.0.0.1
          port: 6000
```

## 使用

### 注入实例

```ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { DiscoveryClient } from '@nest-micro/discovery'

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly discoveryClient: DiscoveryClient) {}

  onModuleInit() {
    this.discoveryClient.getServices()
    this.discoveryClient.getServiceServers('app1')
  }
}
```

## API

[DiscoveryClient API](https://github.com/nest-micro/nest-micro/blob/main/packages/discovery/src/discovery-client.ts)
