import { ClientRequest } from 'http'
import { get, forOwn } from 'lodash'
import { Injectable } from '@nestjs/common'
import { RegisterFilter } from '../decorators/register-filter.decorator'
import { ProxyFilter } from '../interfaces/filter.interface'
import { Request } from '../interfaces/request.interface'

@Injectable()
@RegisterFilter()
export class RequestHeaderFilter implements ProxyFilter {
  request(proxyReq: ClientRequest, request: Request) {
    const parameters = get(request.proxy, 'parameters', {})
    forOwn(parameters, (value, key) => {
      proxyReq.setHeader(key, value)
    })
  }
}
