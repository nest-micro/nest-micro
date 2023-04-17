import { uniqBy } from 'lodash'
import { Injectable } from '@nestjs/common'
import { ProxyFilter } from './interfaces/filter.interface'
import { RouteFilter } from './interfaces/route.interface'

@Injectable()
export class ProxyFilterRegistry {
  private readonly filters = new Map<string, ProxyFilter>()
  private readonly routeFilters = new Map<string, RouteFilter[]>()

  addFilter(name: string, filter: ProxyFilter) {
    this.filters.set(name, filter)
  }

  getFilter(name: string) {
    return this.filters.get(name)
  }

  addRouteFilters(id: string, routeFilters: RouteFilter[]) {
    this.routeFilters.set(id, routeFilters)
  }

  getRouteFilters(id: string): [RouteFilter, ProxyFilter][] {
    const scopeRouteFilters = this.routeFilters.get(id) || []
    const globalRouteFilters = this.getGlobalRouteFilter()
    const routeFilters = uniqBy([...scopeRouteFilters, ...globalRouteFilters], 'name')

    const resultFilters: [RouteFilter, ProxyFilter][] = []
    routeFilters.forEach((routeFilter) => {
      const proxyFilter = this.filters.get(routeFilter.name)
      proxyFilter && resultFilters.push([routeFilter, proxyFilter])
    })

    return resultFilters.sort((a, b) => (a[1].order || Infinity) - (b[1].order || Infinity))
  }

  private getGlobalRouteFilter(): RouteFilter[] {
    const filters: RouteFilter[] = []
    for (const [name, filter] of this.filters.entries()) {
      if (filter.global) {
        filters.push({ name })
      }
    }
    return filters
  }
}
