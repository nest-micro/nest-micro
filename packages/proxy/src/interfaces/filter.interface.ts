import { ClientRequest, IncomingMessage } from 'http'
import { Request } from './request.interface'
import { Response } from './response.interface'

export interface ProxyFilter {
  name?: string

  order?: number

  global?: boolean

  before?(request: Request, response: Response): any | Promise<any>

  request?(proxyReq: ClientRequest, request: Request, response: Response): void

  response?(proxyRes: IncomingMessage, request: Request, response: Response): void

  error?(error: Error, request: Request, response: Response): void
}
