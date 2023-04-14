import { applyDecorators } from '@nestjs/common'
import { ExtendArrayMetadata, GUARDS_METADATA } from '@nest-micro/common'
import { Interceptor } from '../interfaces/interceptor.interface'
import { INTERCEPTOR_METADATA } from '../http.constants'

export const UseInterceptors = (...interceptors: (Function | Interceptor)[]) => {
  return applyDecorators(
    ExtendArrayMetadata(INTERCEPTOR_METADATA, interceptors),
    ExtendArrayMetadata(GUARDS_METADATA, interceptors)
  )
}
