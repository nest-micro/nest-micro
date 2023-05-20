import { AxiosRequestConfig } from 'axios'
import { applyDecorators, SetMetadata } from '@nestjs/common'
import { ExtendMetadata } from '@nest-micro/common'
import { REQUEST_PATH_METADATA, REQUEST_METHOD_METADATA, REQUEST_OPTIONS_METADATA } from '../http.constants'

/**
 * Get 请求方法装饰器
 * @param path 请求 URL
 * @param options 请求配置
 * @returns MethodDecorator
 * @see https://axios-http.com/zh/docs/req_config
 */
export const Get = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('GET', path, options)
}

/**
 * Post 请求方法装饰器
 * @param path 请求 URL
 * @param options 请求配置
 * @returns MethodDecorator
 * @see https://axios-http.com/zh/docs/req_config
 */
export const Post = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('POST', path, options)
}

/**
 * Put 请求方法装饰器
 * @param path 请求 URL
 * @param options 请求配置
 * @returns MethodDecorator
 * @see https://axios-http.com/zh/docs/req_config
 */
export const Put = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('PUT', path, options)
}

/**
 * Delete 请求方法装饰器
 * @param path 请求 URL
 * @param options 请求配置
 * @returns MethodDecorator
 * @see https://axios-http.com/zh/docs/req_config
 */
export const Delete = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('DELETE', path, options)
}

/**
 * Head 请求方法装饰器
 * @param path 请求 URL
 * @param options 请求配置
 * @returns MethodDecorator
 * @see https://axios-http.com/zh/docs/req_config
 */
export const Head = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('HEAD', path, options)
}

/**
 * Patch 请求方法装饰器
 * @param path 请求 URL
 * @param options 请求配置
 * @returns MethodDecorator
 * @see https://axios-http.com/zh/docs/req_config
 */
export const Patch = (path: string, options?: AxiosRequestConfig): MethodDecorator => {
  return createMappingDecorator('PATCH', path, options)
}

/**
 * Options 请求方法装饰器
 * @param path 请求 URL
 * @param options 请求配置
 * @returns MethodDecorator
 * @see https://axios-http.com/zh/docs/req_config
 */
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
