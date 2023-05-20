import { SetMetadata } from '@nestjs/common'
import { REGISTER_INTERCEPTOR_METADATA } from '../http.constants'

/**
 * 声明此类为全局拦截器
 * @returns ClassDecorator
 */
export const RegisterInterceptor = () => {
  return SetMetadata(REGISTER_INTERCEPTOR_METADATA, true)
}
