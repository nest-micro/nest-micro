import { get, isNumber, isString } from 'lodash'
import { Injectable } from '@nestjs/common'
import { RegisterFilter } from '../decorators/register-filter.decorator'
import { ProxyFilter } from '../interfaces/filter.interface'
import { Request } from '../interfaces/request.interface'

interface Parameters {
  strip?: number
  prefix?: string
}

@Injectable()
@RegisterFilter()
export class RequestPathFilter implements ProxyFilter {
  before(request: Request) {
    const parameters: Parameters = get(request.proxy, 'parameters', {})
    let url = request.url!

    if (isNumber(parameters.strip)) {
      url =
        '/' +
        url
          .split('/')
          .slice(parameters.strip + 1)
          .join('/')
    }

    if (isString(parameters.prefix)) {
      url = parameters.prefix + url
    }

    request.url = url
  }
}
