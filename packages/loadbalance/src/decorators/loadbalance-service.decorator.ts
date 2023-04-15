import { SetMetadata } from '@nestjs/common'
import { LOADBALANCE_SERVICE } from '../loadbalance.constants'

export const LoadbalanceService = (service: string) => {
  return SetMetadata(LOADBALANCE_SERVICE, service)
}
