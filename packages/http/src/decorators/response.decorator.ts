import { SetMetadata } from '@nestjs/common'
import { ExtendMetadata } from '@nest-micro/common'
import { RESPONSE_METADATA, REQUEST_OPTIONS_METADATA } from '../http.constants'

/**
 * 自定义响应结构装饰器，使用 _.get(response, field) 获取
 * @param field 属性路径
 * @returns ClassDecorator | MethodDecorator
 * @see https://axios-http.com/zh/docs/res_schema
 */
export const Response = (field?: string) => {
  return SetMetadata(RESPONSE_METADATA, field)
}

/**
 * 响应主体结构装饰器，使用 _.get(response, 'data') 获取
 * @returns ClassDecorator | MethodDecorator
 * @see https://axios-http.com/zh/docs/res_schema
 */
export const ResponseBody = () => {
  return SetMetadata(RESPONSE_METADATA, 'data')
}

/**
 * 设置响应数据类型装饰器
 * @param type
 * @example 'arraybuffer', 'document', 'json', 'text', 'stream'
 * @default json
 * @returns MethodDecorator
 * @see https://axios-http.com/zh/docs/req_config
 */
export const ResponseType = (type: string) => {
  return ExtendMetadata(REQUEST_OPTIONS_METADATA, { responseType: type })
}

/**
 * 设置响应数据编码装饰器
 * @param encoding
 * @example 'utf8'
 * @default utf8
 * @returns MethodDecorator
 * @see https://axios-http.com/zh/docs/req_config
 */
export const ResponseEncode = (encoding: string) => {
  return ExtendMetadata(REQUEST_OPTIONS_METADATA, { responseEncoding: encoding })
}
