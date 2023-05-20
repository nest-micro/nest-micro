import { SetMetadata } from '@nestjs/common'
import { LOADBALANCED } from '../loadbalance.constants'

/**
 * 开启负载均衡支持
 * @param service 服务名称
 * @returns ClassDecorator | MethodDecorator
 */
export const Loadbalanced = (service: string) => {
  return SetMetadata(LOADBALANCED, service)
}
