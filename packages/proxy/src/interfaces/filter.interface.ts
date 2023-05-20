import { ClientRequest, IncomingMessage } from 'http'
import { Request } from './request.interface'
import { Response } from './response.interface'

export interface ProxyFilter {
  /**
   * 名称
   * @default 类名称
   */
  name?: string

  /**
   * 顺序
   * @default 配置顺序
   */
  order?: number

  /**
   * 是否全局，非全局需在路由列表的过滤器配置中添加
   * @default false
   */
  global?: boolean

  /**
   * 转发之前过滤器
   * @description 如果你不需要获取到代理对象，优先使用此钩子函数，它支持异步。
   * @param request 请求对象
   * @param response 响应对象
   */
  before?(request: Request, response: Response): any | Promise<any>

  /**
   * 请求过滤器
   * @param proxyReq 代理请求对象
   * @param request 请求对象
   * @param response 响应对象
   */
  request?(proxyReq: ClientRequest, request: Request, response: Response): void

  /**
   * 响应过滤器
   * @param proxyRes 代理响应对象
   * @param request 请求对象
   * @param response 响应对象
   */
  response?(proxyRes: IncomingMessage, request: Request, response: Response): void

  /**
   * 请求错误过滤器
   * @param error 错误对象
   * @param request 请求对象
   * @param response 响应对象
   */
  error?(error: Error, request: Request, response: Response): void
}
