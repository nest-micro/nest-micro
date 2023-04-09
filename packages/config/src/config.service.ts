import { Injectable } from '@nestjs/common'
import { ConfigStore } from './config.store'
import { ConfigLoader } from './config.loader'

@Injectable()
export class ConfigService {
  constructor(readonly store: ConfigStore, private readonly loader: ConfigLoader) {
    this.store.data = this.loader.load()
  }

  get<T>(path?: string, defaults?: T): T {
    return this.store.get<T>(path, defaults)
  }
}
