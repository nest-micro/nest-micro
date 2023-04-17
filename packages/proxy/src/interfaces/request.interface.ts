import { IncomingMessage } from 'http'

export interface Request extends IncomingMessage {
  proxy?: {
    id: string
    uri: string
    server?: any
    service?: string
    parameters?: { [key: string]: string | number }
  }
}
