import * as HttpProxy from 'http-proxy'

export interface Route {
  /**
   * 标识
   */
  id: string
  /**
   * 地址
   * @example http://127.0.0.1:3000
   * @example lb://app
   */
  uri: string
  /**
   * HttpProxy 配置
   * @see https://github.com/http-party/node-http-proxy
   */
  extras?: HttpProxy.ServerOptions
  /**
   * 过滤器
   */
  filters?: RouteFilter[]
}

export interface RouteFilter {
  /**
   * 名称
   */
  name: string
  /**
   * 参数
   */
  parameters?: { [key: string]: any }
}
