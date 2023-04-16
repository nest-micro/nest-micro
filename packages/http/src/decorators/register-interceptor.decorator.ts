import { SetMetadata } from '@nestjs/common'
import { REGISTER_INTERCEPTOR_METADATA } from '../http.constants'

export const RegisterInterceptor = () => {
  return SetMetadata(REGISTER_INTERCEPTOR_METADATA, true)
}
