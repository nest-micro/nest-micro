import { SetMetadata } from '@nestjs/common'
import { REGISTER_RULES_METADATA } from '../loadbalance.constants'

export const RegisterRule = () => {
  return SetMetadata(REGISTER_RULES_METADATA, true)
}
