import { SetMetadata } from '@nestjs/common'
import { REGISTER_FILTERS_METADATA } from '../proxy.constants'

/**
 * 声明此类为代理过滤器
 * @returns ClassDecorator
 */
export const RegisterFilter = () => {
  return SetMetadata(REGISTER_FILTERS_METADATA, true)
}
