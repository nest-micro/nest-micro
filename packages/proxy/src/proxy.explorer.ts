import { Injectable, OnModuleInit } from '@nestjs/common'
import { Scanner, ScannerClassWithMeta } from '@nest-micro/common'
import { REGISTER_FILTERS_METADATA } from './proxy.constants'
import { ProxyFilter } from './interfaces/filter.interface'
import { ProxyFilterRegistry } from './proxy-filter.registry'

@Injectable()
export class ProxyExplorer implements OnModuleInit {
  constructor(private readonly scanner: Scanner, private readonly filterRegistry: ProxyFilterRegistry) {}

  async onModuleInit() {
    await this.explore()
  }

  async explore() {
    const filters = await this.scanner.providersWithMetaAtKey<Function[]>(REGISTER_FILTERS_METADATA)
    filters.forEach((filter) => {
      this.lookupFilters(filter)
    })
  }

  async lookupFilters(filter: ScannerClassWithMeta<Function[]>) {
    const instance = filter.scannerClass.instance as ProxyFilter
    const name = instance.name || instance.constructor.name
    this.filterRegistry.addFilter(name, instance as ProxyFilter)
  }
}
