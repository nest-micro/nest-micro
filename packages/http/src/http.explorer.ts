import { Injectable, OnModuleInit } from '@nestjs/common'
import { Scanner, ScannerClassWithMeta, ScannerMethodWithMeta } from '@nest-micro/common'
import { RawAxiosRequestConfig } from 'axios'
import { REQUEST_METHOD_METADATA, REGISTER_INTERCEPTOR_METADATA } from './http.constants'
import { HttpMetadataAccessor } from './http-metadata.accessor'
import { HttpOrchestrator } from './http.orchestrator'

@Injectable()
export class HttpExplorer implements OnModuleInit {
  constructor(
    private readonly scanner: Scanner,
    private readonly accessor: HttpMetadataAccessor,
    private readonly orchestrator: HttpOrchestrator
  ) {}

  async onModuleInit() {
    await this.explore()
    await this.orchestrator.mountDecoratorRequests()
  }

  async explore() {
    const methods = await this.scanner.providerMethodsWithMetaAtKey<string>(REQUEST_METHOD_METADATA)
    methods.forEach((method) => {
      this.lookupRequests(method)
    })

    const interceptors = await this.scanner.providersWithMetaAtKey<Function[]>(REGISTER_INTERCEPTOR_METADATA)
    interceptors.forEach((interceptor) => {
      this.lookupGlobalInterceptors(interceptor)
    })
  }

  lookupRequests(method: ScannerMethodWithMeta<string>) {
    const target = method.scannerMethod.handler
    const instance = method.scannerMethod.parentClass.instance as unknown as Function
    const dependency = method.scannerMethod.parentClass.dependencyType
    const methodName = method.scannerMethod.methodName

    const options: RawAxiosRequestConfig = this.accessor.getOptions(target)
    options.url = this.accessor.getPath(target)
    options.method = this.accessor.getMethod(target)

    const paramsMetadata = this.accessor.getParams(target)
    const responseField = this.accessor.getResponse(dependency, target)
    const interceptorRefs = this.accessor.getInterceptorRefs(dependency, target)
    const loadbalanceService = this.accessor.getLoadbalanceService(dependency, target)

    this.orchestrator.addDecoratorRequests({
      instance,
      methodName,
      options,
      paramsMetadata,
      responseField,
      interceptorRefs,
      loadbalanceService,
    })
  }

  lookupGlobalInterceptors(interceptor: ScannerClassWithMeta<Function[]>) {
    const instance = interceptor.scannerClass.instance
    this.orchestrator.addGlobalInterceptors([instance as Function])
  }
}
