import { Injectable, OnModuleInit } from '@nestjs/common'
import { Scanner } from '@nest-micro/common'
import { RawAxiosRequestConfig } from 'axios'
import { REQUEST_METHOD_METADATA } from './http.constants'
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
    const methods = await this.scanner.providerMethodsWithMetaAtKey(REQUEST_METHOD_METADATA)

    methods.forEach((method) => {
      const target = method.discoveredMethod.handler
      const parent = method.discoveredMethod.parentClass.dependencyType
      const instance = method.discoveredMethod.parentClass.instance as unknown as Function
      const methodName = method.discoveredMethod.methodName

      const options: RawAxiosRequestConfig = this.accessor.getOptions(target)
      options.url = this.accessor.getPath(target)
      options.method = this.accessor.getMethod(target)

      const paramsMetadata = this.accessor.getParams(target)
      const responseField = this.accessor.getResponse(parent, target)
      const AdaptersRefs = this.accessor.getAdapterRefs(parent, target)
      const InterceptorRefs = this.accessor.getInterceptorRefs(parent, target)

      this.orchestrator.addDecoratorRequests({
        instance,
        methodName,
        options,
        paramsMetadata,
        responseField,
        AdaptersRefs,
        InterceptorRefs,
      })
    })
  }
}
