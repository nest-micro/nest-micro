import * as HttpProxy from 'http-proxy'

export interface Route {
  id: string
  uri: string
  extras?: HttpProxy.ServerOptions
  filters?: RouteFilter[]
}

export interface RouteFilter {
  name: string
  parameters?: { [key: string]: any }
}
