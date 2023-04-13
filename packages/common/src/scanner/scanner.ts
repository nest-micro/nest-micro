import { flatMap, get, some } from 'lodash'
import { Injectable, Scope, Type } from '@nestjs/common'
import { MetadataScanner, ModulesContainer } from '@nestjs/core'
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants'
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import type { Module } from '@nestjs/core/injector/module'
import {
  DiscoveredClass,
  DiscoveredClassWithMeta,
  DiscoveredMethodWithMeta,
  Filter,
  MetaKey,
} from './scanner.interface'

/**
 * Attempts to retrieve meta information from a Nest DiscoveredClass component
 * @param key The meta key to retrieve data from
 * @param component The discovered component to retrieve meta from
 */
export function getComponentMetaAtKey<T>(key: MetaKey, component: DiscoveredClass): T | undefined {
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
export const withMetaAtKey: (key: MetaKey) => Filter<DiscoveredClass> = (key) => (component) => {
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
  private discoveredProviders?: Promise<DiscoveredClass[]>
  private discoveredControllers?: Promise<DiscoveredClass[]>
  private discoveredInjectables?: Promise<DiscoveredClass[]>

  constructor(private readonly modulesContainer: ModulesContainer, private readonly metadataScanner: MetadataScanner) {}

  /**
   * Discovers all modules in a Nest App that match a filter
   * 根据 filter 查找所有的 modules
   * @param filter
   */
  modules(filter: Filter<Module> = () => true) {
    const modules = [...this.modulesContainer.values()]
    return modules.filter((x) => filter(x))
  }

  /**
   * Discovers all providers in a Nest App that match a filter (Pipes & Guards & Interceptors & ExceptionFilter)
   * 根据 filter 查找所有的 injectables (Pipes & Guards & Interceptors & ExceptionFilter)
   * @param filter
   */
  async injectables(filter: Filter<DiscoveredClass>): Promise<DiscoveredClass[]> {
    if (!this.discoveredInjectables) {
      this.discoveredInjectables = this.discover('injectables')
    }
    return (await this.discoveredInjectables).filter((x) => filter(x))
  }

  /**
   * Discovers all providers in a Nest App that match a filter
   * 根据 filter 查找所有的 providers
   * @param filter
   */
  async providers(filter: Filter<DiscoveredClass>): Promise<DiscoveredClass[]> {
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
  async providersWithMetaAtKey<T>(metaKey: MetaKey): Promise<DiscoveredClassWithMeta<T>[]> {
    const providers = await this.providers(withMetaAtKey(metaKey))

    return providers.map((x) => ({
      meta: getComponentMetaAtKey<T>(metaKey, x) as T,
      discoveredClass: x,
    }))
  }

  /**
   * Discovers all controllers in a Nest App that match a filter
   * 根据 filter 查找所有的 controllers
   * @param filter
   */
  async controllers(filter: Filter<DiscoveredClass>): Promise<DiscoveredClass[]> {
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
  async controllersWithMetaAtKey<T>(metaKey: MetaKey): Promise<DiscoveredClassWithMeta<T>[]> {
    const controllers = await this.controllers(withMetaAtKey(metaKey))

    return controllers.map((x) => ({
      meta: getComponentMetaAtKey<T>(metaKey, x) as T,
      discoveredClass: x,
    }))
  }

  /**
   * Discovers all method handlers matching a particular metakey from a Provider or Controller
   * 根据 metaKey 从实例上查找所有的方法
   * @param component
   * @param metaKey
   */
  classMethodsWithMetaAtKey<T>(component: DiscoveredClass, metaKey: MetaKey): DiscoveredMethodWithMeta<T>[] {
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
    metaKey: MetaKey,
    providerFilter: Filter<DiscoveredClass> = () => true
  ): Promise<DiscoveredMethodWithMeta<T>[]> {
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
    metaKey: MetaKey,
    controllerFilter: Filter<DiscoveredClass> = () => true
  ): Promise<DiscoveredMethodWithMeta<T>[]> {
    const controllers = await this.controllers(controllerFilter)

    return flatMap(controllers, (controller) => this.classMethodsWithMetaAtKey<T>(controller, metaKey))
  }

  private extractMethodMetaAtKey<T>(
    metaKey: MetaKey,
    discoveredClass: DiscoveredClass,
    prototype: any,
    methodName: string
  ): DiscoveredMethodWithMeta<T> {
    const handler = prototype[methodName]
    const meta: T = Reflect.getMetadata(metaKey, handler)

    return {
      meta,
      discoveredMethod: {
        handler,
        methodName,
        parentClass: discoveredClass,
      },
    }
  }

  private async toDiscoveredClass(nestModule: Module, wrapper: InstanceWrapper<any>): Promise<DiscoveredClass> {
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
          .map((component) => this.toDiscoveredClass(nestModule, component))
      })
    )
  }
}
