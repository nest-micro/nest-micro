# Http

用于声明式的请求客户端，基于 [Axios](https://axios-http.com) 实现。

它的目的是用来对应类似 [Ribbon Client](https://github.com/Netflix/ribbon) 服务调用的功能。

## 安装

```bash
npm install --save @nest-micro/http
```

## 开始

[示例应用](https://github.com/nest-micro/nest-micro/tree/main/samples/http)

### 导入模块

```ts
import { Module } from '@nestjs/common'
import { HttpModule } from '@nest-micro/http'

@Module({
  imports: [
    HttpModule.forRoot({
      axios: {
        timeout: 1000,
      },
    }),
    // HttpModule.forRootAsync({
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
import { HttpModule } from '@nest-micro/http'

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.forRootAsync({
      dependencies: [CONFIG],
    }),
  ],
})
export class AppModule {}
```

```yaml
http:
  axios:
    timeout: 1000
```

## 使用

### 装饰器

```ts
import { Injectable } from '@nestjs/common'
import { Get, Query, Post, Body, Param, Put, Delete } from '@nest-micro/http'

@Injectable()
export class ClientService {
  @Get('http://test.com/users')
  getUsers(@Query('role') role: string) {}

  @Post('http://test.com/users')
  createUser(@Body('user') user: any) {}

  @Put('http://test.com/users/:userId')
  updateUser(@Param('userId') userId: string, @Body('user') user: any) {}

  @Delete('http://test.com/users/:userId')
  deleteUser(@Param('userId') userId: string) {}
}
```

### 拦截器

拦截器需要实现 `HttpInterceptor` 接口。如下是一个记录请求日志的例子。

```ts
import { Injectable } from '@nestjs/common'
import { HttpInterceptor, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from '@nest-micro/http'

@Injectable()
export class Log1Interceptor implements HttpInterceptor {
  onRequest(request: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    console.log('Log1Interceptor onRequest')
    return request
  }

  onRequestError(error: AxiosError): any {
    console.log('Log1Interceptor onRequestError')
    return Promise.reject(error)
  }

  onResponse(response: AxiosResponse): any {
    console.log('Log1Interceptor onResponse')
    return response
  }

  onResponseError(error: AxiosError): any {
    console.log('Log1Interceptor onResponseError')
    return Promise.reject(error)
  }
}
```

#### 局部拦截器

局部拦截器需使用 `@UseInterceptors` 装饰器在类或方法上。

```ts
import { UseInterceptors } from '@nest-micro/http'

@UseInterceptors(Interceptor1)
@UseInterceptors(Interceptor2)
export class ClientService {
  @UseInterceptors(Interceptor3)
  @UseInterceptors(Interceptor4)
  getArticles() {}
}

// 执行结果如下
// interceptor1 request
// interceptor2 request
// interceptor3 request
// interceptor4 request
// interceptor4 response
// interceptor3 response
// interceptor2 response
// interceptor1 response
```

#### 全局拦截器

全局拦截器需使用 `@RegisterInterceptor` 装饰器声明此类为拦截器。

```ts
import { Injectable } from '@nestjs/common'
import { HttpInterceptor, RegisterInterceptor } from '@nest-micro/http'

@Injectable()
@RegisterInterceptor()
export class Log1Interceptor implements HttpInterceptor {
  // ...
}
```

并在模块中注入它。

```ts
import { Module } from '@nestjs/common'

@Module({
  providers: [Log1Interceptor],
})
export class AppModule {}
```

### 负载均衡

使用负载均衡需要提前导入 [Loadbalance](./loadbalance.md) 模块，并在类或方法上使用 `@Loadbalanced` 装饰器。

```ts
import { Injectable } from '@nestjs/common'
import { Get, Query } from '@nest-micro/http'
import { Loadbalanced } from '@nest-micro/loadbalance'

@Injectable()
@Loadbalanced('service-name')
export class UserClient {
  @Get('/users')
  getUsers(@Query('role') role: string) {}
}
```

## API

[Http API](https://github.com/nest-micro/nest-micro/blob/main/packages/http/src/http.ts)

[Params Decorator](https://github.com/nest-micro/nest-micro/blob/main/packages/http/src/decorators/params.decorator.ts)

[Request Decorator](https://github.com/nest-micro/nest-micro/blob/main/packages/http/src/decorators/request.decorator.ts)

[Response Decorator](https://github.com/nest-micro/nest-micro/blob/main/packages/http/src/decorators/response.decorator.ts)
