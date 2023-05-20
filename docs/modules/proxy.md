# Proxy

用于请求代理，基于 [Node Http Proxy](https://github.com/http-party/node-http-proxy) 实现。

它的目的是用来对应类似 [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway) 网关的功能。

## 安装

```bash
npm install --save @nest-micro/proxy
```

## 开始

[示例应用](https://github.com/nest-micro/nest-micro/tree/main/samples/proxy)

### 导入模块

```ts
import { Module } from '@nestjs/common'
import { ProxyModule } from '@nest-micro/proxy'

@Module({
  imports: [
    ProxyModule.forRoot({
      extras: {
        timeout: 60000,
      },
      routes: [
        {
          id: 'github',
          uri: 'https://api.github.com',
          filters: [
            {
              name: 'RequestPathFilter',
              parameters: {
                strip: 2,
              },
            },
          ],
        },
      ],
    }),
    // ProxyModule.forRootAsync({
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
import { ProxyModule } from '@nest-micro/proxy'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProxyModule.forRootAsync({
      dependencies: [CONFIG],
    }),
  ],
})
export class AppModule {}
```

```yaml
proxy:
  extras:
    - timeout: 60000
  routes:
    - id: github
      uri: https://api.github.com
      filters:
        - name: RequestPathFilter
          parameters:
            strip: 2
```

## 使用

### 注入实例

```ts
import { All, Controller, Param, Req, Res } from '@nestjs/common'
import { Proxy } from '@nest-micro/proxy'

@Controller('/api/:id/**')
export class ApiController {
  constructor(private readonly proxy: Proxy) {}

  @All()
  async do(@Req() req, @Res() res, @Param('id') id) {
    await this.proxy.forward(req, res, id)
  }
}
```

然后访问 `http://localhost:3000/api/github/` 将代理到 `https://api.github.com`。

### 过滤器

过滤器用于控制代理请求对象和响应对象的修改以及各种逻辑上校验。

代理模块内置了几种常用的过滤器，可在路由过滤器配置中使用它们。

#### RequestPathFilter

代理路径过滤器。参数 `strip` 删除几级路径，参数 `prefix` 添加路径前缀。

```yaml
proxy:
  routes:
    - id: github
      uri: https://api.github.com
      filters:
        - name: RequestPathFilter
          parameters:
            strip: 2 # http://localhost:3000/api/github/users => https://api.github.com/users
            prefix: users # http://localhost:3000/api/github/haiweilian => https://api.github.com/users/haiweilian
```

#### RequestHeaderFilter

代理请求头过滤器。所有参数将添加到请求头中。

```yaml
proxy:
  routes:
    - id: github
      uri: https://api.github.com
      filters:
        - name: RequestHeaderFilter
          parameters:
            authorization: Request dGVzdDp0ZXN0
```

#### ResponseHeaderFilter

代理响应头过滤器。所有参数将添加到响应头中。

```yaml
proxy:
  routes:
    - id: github
      uri: https://api.github.com
      filters:
        - name: ResponseHeaderFilter
          parameters:
            authorization: Response dGVzdDp0ZXN0
```

### 自定义过滤器

自定义过滤器需要实现 `ProxyFilter` 接口，并添加 `@RegisterFilter` 装饰器声明此类为代理过滤器。

```ts
import { Injectable } from '@nestjs/common'
import { ProxyFilter, RegisterFilter, Request, Response } from '@nest-micro/proxy'
import { ClientRequest, IncomingMessage } from 'http'

@Injectable()
@RegisterFilter()
export class LogWebFilter implements ProxyFilter {
  /**
   * 名称
   * @default 类名称
   */
  // name?: string

  /**
   * 顺序
   * @default 配置顺序
   */
  // order?: number

  /**
   * 如果是全局过滤器则立刻生效，非全局过滤器需要在路由过滤器配置中使用它。
   * @default false
   */
  public global = true

  async before(request: Request, response: Response) {
    console.log('LogWebFilter before')
  }

  request(proxyReq: ClientRequest, request: Request, response: Response) {
    console.log('LogWebFilter request')
  }

  response(proxyRes: IncomingMessage, request: Request, response: Response) {
    console.log('LogWebFilter response')
  }

  error(err: Error, request: Request, response: Response) {
    console.log('LogWebFilter error', err)
    response.setHeader('Content-Type', 'application/json')
    response.statusCode = 500
    response.end(JSON.stringify({ message: err.message, status: 500 }))
  }
}
```

并在模块中注入它。

```ts
import { Module } from '@nestjs/common'

@Module({
  providers: [LogWebFilter],
})
export class AppModule {}
```

### 负载均衡

使用负载均衡需要提前导入 [Loadbalance](./loadbalance.md) 模块，并在路由的 `uri` 配置中使用 `lb://service-name` 的格式。

```yaml
proxy:
  routes:
    - id: app
      uri: lb://app

discovery:
  services:
    - name: app
      servers:
        - ip: 127.0.0.1
          port: 3000
```

## API

[Proxy API](https://github.com/nest-micro/nest-micro/blob/main/packages/proxy/src/proxy.ts)
