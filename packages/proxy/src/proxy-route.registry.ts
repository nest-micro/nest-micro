import { Injectable } from '@nestjs/common'
import { Route } from './interfaces/route.interface'

@Injectable()
export class ProxyRouteRegistry {
  private readonly routes = new Map<string, Route>()

  addRoute(id: string, route: Route) {
    this.routes.set(id, route)
  }

  addRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.routes.set(route.id, route)
    })
  }

  getRoute(id: string) {
    return this.routes.get(id)
  }
}
