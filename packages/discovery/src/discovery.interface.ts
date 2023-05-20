import { FactoryProvider } from '@nestjs/common'

export interface ServerInstance {
  /**
   * 标识
   */
  id: string
  /**
   * 地址
   */
  ip: string
  /**
   * 端口
   */
  port: number
  /**
   * 名称
   */
  name?: string
  /**
   * 状态
   */
  status?: boolean
  /**
   * 权重
   */
  weight?: number
  /**
   * 扩展信息
   */
  [index: string]: any
}

export interface ServiceInstance {
  /**
   * 服务名称
   */
  name: string
  /**
   * 实例列表
   */
  servers: ServerInstance[]
  /**
   * 扩展信息
   */
  [index: string]: any
}

export interface DiscoveryOptions {
  /**
   * 服务列表
   */
  services?: ServiceInstance[]
}

export interface DiscoveryAsyncOptions {
  name?: string
  useFactory?: (...args: any[]) => Promise<DiscoveryOptions> | DiscoveryOptions
  inject?: FactoryProvider['inject']
  dependencies?: FactoryProvider['inject']
}
