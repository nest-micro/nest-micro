/**
 * 合并多个装饰器的值为一个对象
 * @example
 */
export const ExtendMetadata = <K = any, V = any>(metadataKey: K, metadataValue: V) => {
  return (target: object, key?: any, descriptor?: any) => {
    if (descriptor) {
      const previousValue = Reflect.getMetadata(metadataKey, descriptor.value) || {}
      const value = Object.assign({}, previousValue, metadataValue)
      Reflect.defineMetadata(metadataKey, value, descriptor.value)
      return descriptor
    }

    const previousValue = Reflect.getMetadata(metadataKey, target) || {}
    const value = Object.assign({}, previousValue, metadataValue)
    Reflect.defineMetadata(metadataKey, value, target)
    return target
  }
}

/**
 * 合并多个装饰器的值为一个数组
 * @example
 */
export const ExtendArrayMetadata = <K = any, V = any>(metadataKey: K, metadataValues: Array<V>) => {
  return (target: object, key?: any, descriptor?: any) => {
    if (descriptor) {
      const previousValue = Reflect.getMetadata(metadataKey, descriptor.value) || []
      const value = [...previousValue, ...metadataValues]
      Reflect.defineMetadata(metadataKey, value, descriptor.value)
      return descriptor
    }

    const previousValue = Reflect.getMetadata(metadataKey, target) || []
    const value = [...previousValue, ...metadataValues]
    Reflect.defineMetadata(metadataKey, value, target)
    return target
  }
}
