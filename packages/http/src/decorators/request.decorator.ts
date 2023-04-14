import { AxiosRequestConfig } from 'axios'
import { applyDecorators, SetMetadata } from '@nestjs/common'
import { ExtendMetadata } from '@nest-micro/common'
import { REQUEST_PATH_METADATA, REQUEST_METHOD_METADATA, REQUEST_OPTIONS_METADATA } from '../http.constants'

export const Get = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('GET', path, options)
}

export const Post = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('POST', path, options)
}

export const Put = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('PUT', path, options)
}

export const Delete = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('DELETE', path, options)
}

export const Head = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('HEAD', path, options)
}

export const Patch = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('PATCH', path, options)
}

export const Options = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('OPTIONS', path, options)
}

const createMappingDecorator = (method: string, path: string, options?: object) => {
  return applyDecorators(
    SetMetadata(REQUEST_PATH_METADATA, path),
    SetMetadata(REQUEST_METHOD_METADATA, method),
    ExtendMetadata(REQUEST_OPTIONS_METADATA, options)
  )
}
