/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'
import { ProxyFilter, RegisterFilter, Request, Response } from '@nest-micro/proxy'
import { ClientRequest, IncomingMessage } from 'http'

@Injectable()
@RegisterFilter()
export class LogWebFilter implements ProxyFilter {
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
  }
}
