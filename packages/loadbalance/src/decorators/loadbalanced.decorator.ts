import { SetMetadata } from '@nestjs/common'
import { LOADBALANCED } from '../loadbalance.constants'

export const Loadbalanced = (service: string) => {
  return SetMetadata(LOADBALANCED, service)
}
