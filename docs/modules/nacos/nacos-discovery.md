# Nacos Discovery

用于从 Nacos 服务中心中注册服务和发现服务。

它的目的是用来对应类似 [Spring Cloud Alibaba](https://spring.io/projects/spring-cloud-alibaba) 服务注册和服务发现的功能。

::: tip
此模块是作为 `discovery` 模块的扩展功能。

它读取的服务和实例会同步到 `discovery` 模块管理，所以你可以使用 `discovery` 中的所有功能。
:::

## 安装

依赖 [Discovery](../discovery.md) 模块。

```bash
npm install --save @nest-micro/discovery
npm install --save @nest-micro/nacos-discovery
```

## 开始

[示例应用](https://github.com/nest-micro/nest-micro/tree/main/samples/nacos/nacos-discovery)

### 导入模块

```ts
import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nest-micro/discovery'
import { NacosDiscoveryModule } from '@nest-micro/nacos-discovery'

@Module({
  imports: [
    DiscoveryModule.forRoot(),
    NacosDiscoveryModule.forRoot({
      // logger: false,
      client: {
        serverList: '127.0.0.1:8848',
        namespace: '5f8d158f-c2b0-4d12-bc8b-03496d993dfb',
      },
      instance: {
        // ip: '127.0.0.1', // 默认使用 address 包获取到内网IP
        port: 3000,
        serviceName: 'discovery',
        metadata: {
          version: process.version,
        },
      },
      subscribes: [
        {
          serviceName: 'discovery',
        },
        {
          serviceName: 'discovery-nacos',
        },
      ],
    }),
    // NacosDiscoveryModule.forRootAsync({
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

如果使用了 [Config](../config.md) 模块。指定 `dependencies` 依赖，可自动从配置文件中读取配置。

```ts {2,3,9,12}
import { Module } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { ConfigModule } from '@nest-micro/config'
import { DiscoveryModule } from '@nest-micro/discovery'
import { NacosDiscoveryModule } from '@nest-micro/nacos-discovery'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule.forRoot(),
    NacosDiscoveryModule.forRootAsync({
      dependencies: [CONFIG],
    }),
  ],
})
export class AppModule {}
```

```yaml
nacos:
  discovery:
    logger: false
    client:
      serverList: 127.0.0.1:8848
      namespace: 5f8d158f-c2b0-4d12-bc8b-03496d993dfb
    instance:
      # ip: 127.0.0.1
      port: 3000
      serviceName: discovery
      metadata: null
    subscribes:
      - serviceName: discovery
      - serviceName: discovery-nacos
```

## 使用

### 注入实例

```ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { NacosDiscovery } from '@nest-micro/nacos-discovery'

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly nacosDiscovery: NacosDiscovery) {}

  async onModuleInit() {
    await this.nacosDiscovery.registerInstance({
      serviceName: 'discovery',
      ip: '127.0.0.1',
      port: 3000,
      metadata: {
        version: process.version,
      },
    })

    await this.nacosDiscovery.getAllInstances('discovery')
  }
}
```

## API

[NacosDiscovery API](https://github.com/nest-micro/nest-micro/blob/main/packages/nacos/nacos-discovery/src/nacos-discovery.ts)
