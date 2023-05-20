import { applyDecorators } from '@nestjs/common'
import { ExtendArrayMetadata, GUARDS_METADATA } from '@nest-micro/common'
import { HttpInterceptor } from '../interfaces/interceptor.interface'
import { INTERCEPTOR_METADATA } from '../http.constants'

/**
 * 局部使用拦截器
 * @returns ClassDecorator | MethodDecorator
 */
export const UseInterceptors = (...interceptors: (Function | HttpInterceptor)[]) => {
  return applyDecorators(
    ExtendArrayMetadata(INTERCEPTOR_METADATA, interceptors),
    ExtendArrayMetadata(GUARDS_METADATA, interceptors) // Hack Guard
  )
}
