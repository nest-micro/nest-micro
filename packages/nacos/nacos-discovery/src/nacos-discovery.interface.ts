import { FactoryProvider } from '@nestjs/common'

export interface NacosNamingClientOptions {
  serverList: string | string[]
  namespace?: string
  ssl?: boolean
  ak?: string
  sk?: string
  appName?: string
  endpoint?: string
  vipSrvRefInterMillis?: number
}

export interface NacosNamingInstance {
  instanceId: string
  clusterName: string
  serviceName: string
  ip: string
  port: number
  weight: number
  ephemeral: boolean
  enabled: boolean
  valid: boolean
  marked: boolean
  healthy: boolean
  metadata: any
}

export interface NacosNamingInstanceOptions {
  serviceName: string
  clusterName?: string
  groupName?: string
  ip?: string
  port: number
  weight?: number
  valid?: boolean
  healthy?: boolean
  enabled?: boolean
  ephemeral?: boolean
  metadata?: any
}

export interface NacosNamingSubscribeOptions {
  serviceName: string
  groupName?: string
  clusters?: string
}

export interface NacosDiscoveryOptions {
  /**
   * 是否启用日志
   * @default true
   */
  logger?: boolean
  /**
   * 客户端连接配置
   */
  client?: NacosNamingClientOptions
  /**
   * 实例信息
   * @default ip 默认使用 address 包获取到内网IP
   */
  instance?: NacosNamingInstanceOptions
  /**
   * 订阅服务
   */
  subscribes?: NacosNamingSubscribeOptions[]
}

export interface NacosDiscoveryAsyncOptions {
  name?: string
  useFactory?: (...args: any[]) => Promise<NacosDiscoveryOptions> | NacosDiscoveryOptions
  inject?: FactoryProvider['inject']
  dependencies?: FactoryProvider['inject']
}
