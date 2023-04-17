import { RequestPathFilter } from './filters/request-path.filter'
import { RequestHeaderFilter } from './filters/request-header.filter'
import { ResponseHeaderFilter } from './filters/response-header.filter'

export const ProxyFilterRegister = [RequestPathFilter, RequestHeaderFilter, ResponseHeaderFilter]
