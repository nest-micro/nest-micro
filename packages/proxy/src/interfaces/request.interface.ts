import { IncomingMessage } from 'http'

export interface Request extends IncomingMessage {
  /**
   * 附加到请求上的代理配置
   */
  proxy?: {
    id: string
    uri: string
    server?: any
    service?: string
    parameters?: { [key: string]: string | number }
  }
}
