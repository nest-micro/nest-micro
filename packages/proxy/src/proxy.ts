import { URL } from 'url'
import { get } from 'lodash'
import * as HttpProxy from 'http-proxy'
import { ClientRequest, IncomingMessage } from 'http'
import { Injectable, OnApplicationBootstrap, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { Scanner, LOADBALANCE } from '@nest-micro/common'
import { Route } from './interfaces/route.interface'
import { Request } from './interfaces/request.interface'
import { Response } from './interfaces/response.interface'
import { ProxyConfig } from './proxy.config'
import { ProxyRouteRegistry } from './proxy-route.registry'
import { ProxyFilterRegistry } from './proxy-filter.registry'

@Injectable()
export class Proxy implements OnApplicationBootstrap {
  private proxy!: HttpProxy
  private loadbalance: any

  constructor(
    private readonly scanner: Scanner,
    private readonly config: ProxyConfig,
    private readonly filterRegistry: ProxyFilterRegistry,
    private readonly routeRegistry: ProxyRouteRegistry
  ) {}

  async onApplicationBootstrap() {
    await this.useLb()
    this.initRoutes()
    this.initProxyServer()
  }

  async forward(req: Request, res: Response, id: string) {
    const route = this.routeRegistry.getRoute(id)
    if (!route) {
      throw new NotFoundException('No route config found in proxy config files, please check it.')
    }

    if (route.uri.startsWith('lb://')) {
      return this.forwardLbRequest(req, res, route)
    } else if (route.uri.startsWith('http://') || route.uri.startsWith('https://')) {
      return this.forwardRequest(req, res, route)
    }
  }

  private async useLb() {
    this.loadbalance = (await this.scanner.providers((provider) => provider.name === LOADBALANCE))[0]?.instance
  }

  private initRoutes() {
    const routes: Route[] = this.config.getRoutes()
    routes.forEach((route) => {
      route.filters = route.filters ?? []
      route.filters = route.filters.filter((filter) => filter.name)
      this.routeRegistry.addRoute(route.id, route)
      this.filterRegistry.addRouteFilters(route.id, route.filters)
    })
  }

  private initProxyServer() {
    this.proxy = HttpProxy.createProxyServer(this.config.getExtras())

    // @ts-expect-error
    this.proxy.on('error', (err: Error, req: Request, res: Response) => {
      const filters = this.filterRegistry.getRouteFilters(get(req.proxy, 'id')!)
      for (const [routeFilter, proxyFilter] of filters) {
        if (proxyFilter.error) {
          req.proxy!.parameters = routeFilter.parameters
          proxyFilter.error(err, req, res)
        }
      }
    })

    this.proxy.on('proxyReq', (proxyReq: ClientRequest, req: Request, res: Response) => {
      const filters = this.filterRegistry.getRouteFilters(get(req.proxy, 'id')!)
      for (const [routeFilter, proxyFilter] of filters) {
        if (proxyFilter.request) {
          req.proxy!.parameters = routeFilter.parameters
          proxyFilter.request(proxyReq, req, res)
        }
      }
    })

    this.proxy.on('proxyRes', (proxyRes: IncomingMessage, req: Request, res: Response) => {
      const filters = this.filterRegistry.getRouteFilters(get(req.proxy, 'id')!)
      for (const [routeFilter, proxyFilter] of filters) {
        if (proxyFilter.response) {
          req.proxy!.parameters = routeFilter.parameters
          proxyFilter.response(proxyRes, req, res)
        }
      }
    })

    this.proxy.on('start', () => {
      // console.log('todo proxy start on')
    })

    this.proxy.on('end', () => {
      // console.log('todo proxy end on')
    })

    this.proxy.on('econnreset', () => {
      // console.log('todo proxy econnreset on')
    })

    this.proxy.on('proxyReqWs', () => {
      // console.log('todo proxy proxyReqWs on')
    })

    this.proxy.on('open', () => {
      // console.log('todo proxy open on')
    })

    this.proxy.on('close', () => {
      // console.log('todo proxy close on')
    })
  }

  private async forwardRequest(req: Request, res: Response, route: Route) {
    req.proxy = {
      id: route.id,
      uri: route.uri,
    }

    await this.processBeforeFilter(req, res)

    const target = `${route.uri}${req.url}`
    const proxyOptions = route.extras || {}
    req.headers.host = new URL(target).host

    this.proxy.web(req, res, {
      ...proxyOptions,
      target,
      prependPath: true,
      ignorePath: true,
    })
  }

  private async forwardLbRequest(req: Request, res: Response, route: Route) {
    const service = route.uri.replace('lb://', '')
    if (!this.loadbalance) {
      throw new InternalServerErrorException(`No lb module was found`)
    }

    const server = this.loadbalance.choose(service)
    if (!server) {
      throw new InternalServerErrorException(`No available server can handle this request`)
    }

    req.proxy = {
      server,
      service,
      id: route.id,
      uri: route.uri,
    }

    await this.processBeforeFilter(req, res)

    const secure = get(route.extras, 'secure', false)
    const target = `${secure ? 'https' : 'http'}://${server.ip}:${server.port}${req.url}`
    const proxyOptions = route.extras || {}
    req.headers.host = new URL(target).host

    this.proxy.web(req, res, {
      ...proxyOptions,
      target,
      prependPath: true,
      ignorePath: true,
    })
  }

  private async processBeforeFilter(req: Request, res: Response) {
    const filters = this.filterRegistry.getRouteFilters(get(req.proxy, 'id')!)
    for (const [routeFilter, proxyFilter] of filters) {
      if (proxyFilter.before) {
        req.proxy!.parameters = routeFilter.parameters
        await proxyFilter.before(req, res)
      }
    }
  }
}
