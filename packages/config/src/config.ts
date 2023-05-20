import { Injectable } from '@nestjs/common'
import { ConfigStore } from './config.store'
import { ConfigLoader } from './config.loader'

@Injectable()
export class Config {
  constructor(readonly store: ConfigStore, private readonly loader: ConfigLoader) {
    this.store.data = this.loader.load()
  }

  /**
   * 根据 path 路径获取值(与 lodash.get 一致)
   * @param path 要获取属性的路径
   * @param defaults 默认值，如果解析值是 undefined 则返回
   * @returns T
   */
  get<T>(path?: string, defaults?: T): T {
    return this.store.get<T>(path, defaults)
  }
}
