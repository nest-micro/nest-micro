import { get, forOwn } from 'lodash'
import { IncomingMessage } from 'http'
import { Injectable } from '@nestjs/common'
import { RegisterFilter } from '../decorators/register-filter.decorator'
import { ProxyFilter } from '../interfaces/filter.interface'
import { Request } from '../interfaces/request.interface'
import { Response } from '../interfaces/response.interface'

/**
 * 响应头过滤器
 */
@Injectable()
@RegisterFilter()
export class ResponseHeaderFilter implements ProxyFilter {
  response(proxyRes: IncomingMessage, request: Request, response: Response) {
    const parameters = get(request.proxy, 'parameters', {})
    forOwn(parameters, (value, key) => {
      response.setHeader(key, value)
    })
  }
}
