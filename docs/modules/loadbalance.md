# Loadbalance

用于服务选择的负载均衡器。

它的目的是用来对应类似 [Ribbon Loadbalancer](https://github.com/Netflix/ribbon) 负载均衡的功能。

## 安装

依赖 [Discovery](./discovery.md) 模块，从而发现服务列表。

```bash
npm install --save @nest-micro/discovery
npm install --save @nest-micro/loadbalance
```

## 开始

[示例应用](https://github.com/nest-micro/nest-micro/tree/main/samples/loadbalance)

### 导入模块

```ts
import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nest-micro/discovery'
import { LoadbalanceModule } from '@nest-micro/loadbalance'

@Module({
  imports: [
    DiscoveryModule.forRoot(),
    LoadbalanceModule.forRoot({
      rule: 'RandomRule',
      services: [
        {
          name: 'app2',
          rule: 'RoundRobinRule',
        },
      ],
    }),
    // LoadbalanceModule.forRootAsync({
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

```ts {2,3,9,12}
import { Module } from '@nestjs/common'
import { CONFIG } from '@nest-micro/common'
import { ConfigModule } from '@nest-micro/config'
import { DiscoveryModule } from '@nest-micro/discovery'
import { LoadbalanceModule } from '@nest-micro/loadbalance'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule.forRoot(),
    LoadbalanceModule.forRootAsync({
      dependencies: [CONFIG],
    }),
  ],
})
export class AppModule {}
```

```yaml
loadbalance:
  rule: RandomRule
  services:
    - name: app2
      rule: RoundRobinRule
```

## 使用

### 注入实例

```ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { Loadbalance } from '@nest-micro/loadbalance'

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly loadbalance: Loadbalance) {}

  onModuleInit() {
    this.loadbalance.choose('app1')
    this.loadbalance.choose('app2')
  }
}
```

### 规则

规则是具体的负载均衡算法。

模块内置了几种常用的规则，如果配置中不指定则默认是 `RandomRule` 随机规则。

#### RandomRule

通过随机数生成算法选取一个服务器。

```yaml
loadbalance:
  rule: RandomRule
```

#### RoundRobinRule

轮询算法按顺序把每个新的连接请求分配给下一个服务器。

```yaml
loadbalance:
  rule: RoundRobinRule
```

### 自定义规则

自定义规则需要实现 `LoadbalanceRule` 接口，并添加 `@RegisterRule` 装饰器声明此类为负载均衡规则。如下是一个永远选择第一个服务实例的例子。

```ts
import { Injectable } from '@nestjs/common'
import { Loadbalancer, LoadbalanceRule, RegisterRule } from '@nest-micro/loadbalance'

@Injectable()
@RegisterRule()
export class FirstRule implements LoadbalanceRule {
  /**
   * 规则名称
   * @default 当前类名
   */
  // public name = 'CustomNameRule'

  /**
   * 选择服务实例
   * @param loadbalancer 当前服务的负载均衡实例
   * @returns LoadbalanceServer 选择的服务实例
   */
  choose(loadbalancer: Loadbalancer) {
    const reachableServers = loadbalancer.servers
    const reachableServersCount = reachableServers.length

    if (reachableServersCount === 0) {
      return null
    }

    return reachableServers[0]
  }
}
```

然后注入它，并在配置中使用。

```ts
import { Module } from '@nestjs/common'
import { FirstRule } from './rules/first.rule'

@Module({
  providers: [FirstRule],
})
export class AppModule {}
```

```yaml
loadbalance:
  rule: FirstRule
```

## API

[Loadbalance API](https://github.com/nest-micro/nest-micro/blob/main/packages/loadbalance/src/loadbalance.ts)

[Loadbalancer API](https://github.com/nest-micro/nest-micro/blob/main/packages/loadbalance/src/loadbalancer.ts)
