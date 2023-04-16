import { flatMap, get, some } from 'lodash'
import { Injectable, Scope, Type } from '@nestjs/common'
import { MetadataScanner, ModulesContainer } from '@nestjs/core'
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants'
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import type { Module } from '@nestjs/core/injector/module'
import {
  ScannerClass,
  ScannerClassWithMeta,
  ScannerMethodWithMeta,
  ScannerFilter,
  ScannerMetaKey,
} from './scanner.interface'

/**
 * Attempts to retrieve meta information from a Nest DiscoveredClass component
 * @param key The meta key to retrieve data from
 * @param component The discovered component to retrieve meta from
 */
export function getComponentMetaAtKey<T>(key: ScannerMetaKey, component: ScannerClass): T | undefined {
  const dependencyMeta = Reflect.getMetadata(key, component.dependencyType) as T
  if (dependencyMeta) {
    return dependencyMeta
  }

  if (component.injectType != null) {
    return Reflect.getMetadata(key, component.injectType) as T
  }
}

/**
 * A filter that can be used to search for DiscoveredClasses in an App that contain meta attached to a certain key
 * @param key The meta key to search for
 */
export const withMetaAtKey: (key: ScannerMetaKey) => ScannerFilter<ScannerClass> = (key) => (component) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  // @ts-expect-error
  const metaTargets: [] = [
    get(component, 'instance.constructor'),
    // eslint-disable-next-line @typescript-eslint/ban-types
    component.injectType as Function,
  ].filter((x) => x != null)

  return some(metaTargets, (x) => Reflect.getMetadata(key, x))
}

/**
 * extends https://github.com/golevelup/nestjs/blob/master/packages/discovery/README.md
 * - add modules functions
 * - add injectables functions
 */
@Injectable()
export class Scanner {
  private discoveredProviders?: Promise<ScannerClass[]>
  private discoveredControllers?: Promise<ScannerClass[]>
  private discoveredInjectables?: Promise<ScannerClass[]>

  constructor(private readonly modulesContainer: ModulesContainer, private readonly metadataScanner: MetadataScanner) {}

  /**
   * Discovers all modules in a Nest App that match a filter
   * 根据 filter 查找所有的 modules
   * @param filter
   */
  modules(filter: ScannerFilter<Module> = () => true) {
    const modules = [...this.modulesContainer.values()]
    return modules.filter((x) => filter(x))
  }

  /**
   * Discovers all providers in a Nest App that match a filter (Pipes & Guards & Interceptors & ExceptionFilter)
   * 根据 filter 查找所有的 injectables (Pipes & Guards & Interceptors & ExceptionFilter)
   * @param filter
   */
  async injectables(filter: ScannerFilter<ScannerClass>): Promise<ScannerClass[]> {
    if (!this.discoveredInjectables) {
      this.discoveredInjectables = this.discover('injectables')
    }
    return (await this.discoveredInjectables).filter((x) => filter(x))
  }

  /**
   * Discovers all providers instance in a Nest App that dependencys (Pipes & Guards & Interceptors & ExceptionFilter)
   * 根据 injectables 构造函数查找所有的 injectables 实例
   * @example 如果当前类被 Nest 管理，则从内部获取实例 => @UseInterceptors(LogInterceptor)
   * @example 如果当前类不被 Nest 管理，则传入的就是实例 => @UseInterceptors(new LogInterceptor())
   * @param dependencys
   */
  async injectablesInstanceWithDependencys<T>(dependencys: Function[]): Promise<T[]> {
    const injectables = await this.injectables(() => true)
    const instances: any[] = []
    for (const dependency of dependencys) {
      const injectable = injectables.find((i) => dependency === i.dependencyType)
      if (injectable) {
        instances.push(injectable.instance)
      } else {
        instances.push(dependency)
      }
    }
    return instances
  }

  /**
   * Discovers all providers in a Nest App that match a filter
   * 根据 filter 查找所有的 providers
   * @param filter
   */
  async providers(filter: ScannerFilter<ScannerClass>): Promise<ScannerClass[]> {
    if (!this.discoveredProviders) {
      this.discoveredProviders = this.discover('providers')
    }
    return (await this.discoveredProviders).filter((x) => filter(x))
  }

  /**
   * Discovers all providers in an App that have meta at a specific key and returns the provider(s) and associated meta
   * 根据 metaKey 查找所有的 providers
   * @param metaKey The metakey to scan for
   */
  async providersWithMetaAtKey<T>(metaKey: ScannerMetaKey): Promise<ScannerClassWithMeta<T>[]> {
    const providers = await this.providers(withMetaAtKey(metaKey))

    return providers.map((x) => ({
      meta: getComponentMetaAtKey<T>(metaKey, x) as T,
      scannerClass: x,
    }))
  }

  /**
   * Discovers all controllers in a Nest App that match a filter
   * 根据 filter 查找所有的 controllers
   * @param filter
   */
  async controllers(filter: ScannerFilter<ScannerClass>): Promise<ScannerClass[]> {
    if (!this.discoveredControllers) {
      this.discoveredControllers = this.discover('controllers')
    }
    return (await this.discoveredControllers).filter((x) => filter(x))
  }

  /**
   * Discovers all controllers in an App that have meta at a specific key and returns the controller(s) and associated meta
   * 根据 metaKey 查找所有的 controllers
   * @param metaKey The metakey to scan for
   */
  async controllersWithMetaAtKey<T>(metaKey: ScannerMetaKey): Promise<ScannerClassWithMeta<T>[]> {
    const controllers = await this.controllers(withMetaAtKey(metaKey))

    return controllers.map((x) => ({
      meta: getComponentMetaAtKey<T>(metaKey, x) as T,
      scannerClass: x,
    }))
  }

  /**
   * Discovers all method handlers matching a particular metakey from a Provider or Controller
   * 根据 metaKey 从实例上查找所有的方法
   * @param component
   * @param metaKey
   */
  classMethodsWithMetaAtKey<T>(component: ScannerClass, metaKey: ScannerMetaKey): ScannerMethodWithMeta<T>[] {
    const { instance } = component

    if (!instance) {
      return []
    }

    const prototype = Object.getPrototypeOf(instance)

    return this.metadataScanner
      .scanFromPrototype(instance, prototype, (name) =>
        this.extractMethodMetaAtKey<T>(metaKey, component, prototype, name)
      )
      .filter((x) => !!x.meta)
  }

  /**
   * Discovers all the methods that exist on providers in a Nest App that contain metadata under a specific key
   * 根据 metaKey 和 providerFilter 从 providers 上查找所有的方法
   * @param metaKey The metakey to scan for
   * @param providerFilter A predicate used to limit the providers being scanned. Defaults to all providers in the app module
   */
  async providerMethodsWithMetaAtKey<T>(
    metaKey: ScannerMetaKey,
    providerFilter: ScannerFilter<ScannerClass> = () => true
  ): Promise<ScannerMethodWithMeta<T>[]> {
    const providers = await this.providers(providerFilter)

    return flatMap(providers, (provider) => this.classMethodsWithMetaAtKey<T>(provider, metaKey))
  }

  /**
   * Discovers all the methods that exist on controllers in a Nest App that contain metadata under a specific key
   * 根据 metaKey 和 controllerFilter 从 controllers 上查找所有的方法
   * @param metaKey The metakey to scan for
   * @param controllerFilter A predicate used to limit the controllers being scanned. Defaults to all providers in the app module
   */
  async controllerMethodsWithMetaAtKey<T>(
    metaKey: ScannerMetaKey,
    controllerFilter: ScannerFilter<ScannerClass> = () => true
  ): Promise<ScannerMethodWithMeta<T>[]> {
    const controllers = await this.controllers(controllerFilter)

    return flatMap(controllers, (controller) => this.classMethodsWithMetaAtKey<T>(controller, metaKey))
  }

  private extractMethodMetaAtKey<T>(
    metaKey: ScannerMetaKey,
    scannerClass: ScannerClass,
    prototype: any,
    methodName: string
  ): ScannerMethodWithMeta<T> {
    const handler = prototype[methodName]
    const meta: T = Reflect.getMetadata(metaKey, handler)

    return {
      meta,
      scannerMethod: {
        handler,
        methodName,
        parentClass: scannerClass,
      },
    }
  }

  private async toScannerClass(nestModule: Module, wrapper: InstanceWrapper<any>): Promise<ScannerClass> {
    const instanceHost = wrapper.getInstanceByContextId(STATIC_CONTEXT, wrapper && wrapper.id ? wrapper.id : undefined)

    if (instanceHost.isPending && !instanceHost.isResolved) {
      await instanceHost.donePromise
    }

    return {
      name: wrapper.name as string,
      instance: instanceHost.instance,
      injectType: wrapper.metatype,
      dependencyType: get(instanceHost, 'instance.constructor'),
      parentModule: {
        name: nestModule.metatype.name,
        instance: nestModule.instance,
        injectType: nestModule.metatype,
        dependencyType: nestModule.instance.constructor as Type<object>,
      },
    }
  }

  private async discover(component: 'providers' | 'controllers' | 'injectables') {
    const modulesMap = [...this.modulesContainer.entries()]
    return Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      flatMap(modulesMap, ([key, nestModule]) => {
        const components = [...nestModule[component].values()]
        return components
          .filter((component) => component.scope !== Scope.REQUEST)
          .map((component) => this.toScannerClass(nestModule, component))
      })
    )
  }
}
