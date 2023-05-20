import { AxiosRequestConfig } from 'axios'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ParamsMetadata } from './interfaces/params-metadata.interface'
import {
  REQUEST_PATH_METADATA,
  REQUEST_METHOD_METADATA,
  REQUEST_OPTIONS_METADATA,
  PARAMETER_METADATA,
  RESPONSE_METADATA,
  INTERCEPTOR_METADATA,
  LOADBALANCE_SERVICE,
} from './http.constants'

@Injectable()
export class HttpMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  getPath(target: Function): string {
    return this.reflector.get(REQUEST_PATH_METADATA, target)
  }

  getMethod(target: Function): string {
    return this.reflector.get(REQUEST_METHOD_METADATA, target)
  }

  getOptions(target: Function): AxiosRequestConfig {
    return this.reflector.get(REQUEST_OPTIONS_METADATA, target)
  }

  getParams(target: Function): ParamsMetadata {
    return this.reflector.get(PARAMETER_METADATA, target)
  }

  getResponse(dependency: Function, target: Function): string {
    return this.reflector.getAllAndOverride(RESPONSE_METADATA, [dependency, target])
  }

  getInterceptorRefs(dependency: Function, target: Function): Function[] {
    return this.reflector.getAllAndMerge(INTERCEPTOR_METADATA, [dependency, target])
  }

  getLoadbalanceService(dependency: Function, target: Function) {
    return this.reflector.getAllAndOverride(LOADBALANCE_SERVICE, [dependency, target])
  }
}
