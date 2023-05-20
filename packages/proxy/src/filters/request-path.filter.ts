import { get, trim, isNumber, isString } from 'lodash'
import { Injectable } from '@nestjs/common'
import { RegisterFilter } from '../decorators/register-filter.decorator'
import { ProxyFilter } from '../interfaces/filter.interface'
import { Request } from '../interfaces/request.interface'

interface Parameters {
  strip?: number
  prefix?: string
}

/**
 * 内置请求路径过滤器
 */
@Injectable()
@RegisterFilter()
export class RequestPathFilter implements ProxyFilter {
  before(request: Request) {
    const parameters: Parameters = get(request.proxy, 'parameters', {})
    const separator = '/'

    let url = trim(trim(request.url!), separator)

    if (isNumber(parameters.strip)) {
      url = url.split(separator).slice(parameters.strip).join(separator)
    }

    if (isString(parameters.prefix)) {
      url = trim(parameters.prefix, separator) + separator + url
    }

    request.url = separator + url
  }
}
