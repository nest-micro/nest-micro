import { Inject } from '@nestjs/common'
import { LOADBALANCE_OPTIONS } from './loadbalance.constants'
import { LoadbalanceOptions, ServiceOptions } from './interfaces/loadbalance.interface'

export class LoadbalanceConfig {
  constructor(@Inject(LOADBALANCE_OPTIONS) private readonly options: LoadbalanceOptions) {}

  getGlobalRule(): string {
    return this.options.rule || 'RandomRule'
  }

  getServiceOptions(): ServiceOptions[] {
    return this.options.services || []
  }

  getRule(serviceName: string): string {
    const services = this.getServiceOptions()
    const service = services.find((item) => item.name === serviceName)
    if (service && service.rule) {
      return service.rule
    }
    return this.getGlobalRule()
  }
}
