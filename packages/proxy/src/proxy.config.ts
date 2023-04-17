import { Inject, Injectable } from '@nestjs/common'
import { ProxyOptions } from './interfaces/proxy.interface'
import { PROXY_OPTIONS } from './proxy.constants'

@Injectable()
export class ProxyConfig {
  constructor(@Inject(PROXY_OPTIONS) private readonly options: ProxyOptions) {}

  getRoutes() {
    return this.options.routes || []
  }

  getExtras() {
    return this.options.extras || {}
  }
}
