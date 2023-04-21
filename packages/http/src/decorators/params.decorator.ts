import {
  PARAMETER_METADATA,
  PARAMETER_BODY_METADATA,
  PARAMETER_QUERY_METADATA,
  PARAMETER_PARAM_METADATA,
  PARAMETER_HEADER_METADATA,
} from '../http.constants'

export const Body = (field?: string): ParameterDecorator => {
  return createParameterDecorator(PARAMETER_BODY_METADATA)(field!)
}

export const Query = (field?: string): ParameterDecorator => {
  return createParameterDecorator(PARAMETER_QUERY_METADATA)(field!)
}

export const Param = (field?: string): ParameterDecorator => {
  return createParameterDecorator(PARAMETER_PARAM_METADATA)(field!)
}

export const Header = (field?: string): ParameterDecorator => {
  return createParameterDecorator(PARAMETER_HEADER_METADATA)(field!)
}

export const SetBody = (field: string, value: any): MethodDecorator => {
  return createSetParameterDecorator(PARAMETER_BODY_METADATA)(field, value)
}

export const SetQuery = (field: string, value: any): MethodDecorator => {
  return createSetParameterDecorator(PARAMETER_QUERY_METADATA)(field, value)
}

export const SetParam = (field: string, value: any): MethodDecorator => {
  return createSetParameterDecorator(PARAMETER_PARAM_METADATA)(field, value)
}

export const SetHeader = (field: string, value: any): MethodDecorator => {
  return createSetParameterDecorator(PARAMETER_HEADER_METADATA)(field, value)
}

const assignMetadata = (args: object, paramtype: string, index: string, data: string, value: any) => {
  return Object.assign({}, args, {
    [`${paramtype}:${index}`]: { index, data, value },
  })
}

const createParameterDecorator = (paramType: string) => {
  return (data: string, value?: any) => (target: any, key: any, index: any) => {
    const args = Reflect.getMetadata(PARAMETER_METADATA, target[key]) || {}
    Reflect.defineMetadata(PARAMETER_METADATA, assignMetadata(args, paramType, index, data, value), target[key])
  }
}

const createSetParameterDecorator = (paramType: string) => {
  return (data: string, value?: any) => (target: any, key: any) => {
    const args = Reflect.getMetadata(PARAMETER_METADATA, target[key]) || {}
    const index = `const__${data}`
    Reflect.defineMetadata(PARAMETER_METADATA, assignMetadata(args, paramType, index, data, value), target[key])
  }
}
