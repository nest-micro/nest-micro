import { FactoryProvider } from '@nestjs/common'

export interface ServiceOptions {
  /**
   * 服务名称
   */
  name: string
  /**
   * 服务规则
   */
  rule: string
}

export interface LoadbalanceOptions {
  /**
   * 全局规则
   * @default RandomRule
   */
  rule?: string
  /**
   * 服务列表
   */
  services?: ServiceOptions[]
}

export interface LoadbalanceAsyncOptions {
  name?: string
  useFactory?: (...args: any[]) => Promise<LoadbalanceOptions> | LoadbalanceOptions
  inject?: FactoryProvider['inject']
  dependencies?: FactoryProvider['inject']
}
