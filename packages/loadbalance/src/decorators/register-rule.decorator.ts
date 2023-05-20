import { SetMetadata } from '@nestjs/common'
import { REGISTER_RULES_METADATA } from '../loadbalance.constants'

/**
 * 声明此类为负载均衡规则
 * @returns ClassDecorator
 */
export const RegisterRule = () => {
  return SetMetadata(REGISTER_RULES_METADATA, true)
}
