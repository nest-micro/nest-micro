import { Type } from '@nestjs/common'

export interface ScannerModule<T = object> {
  name: string | symbol
  instance: T
  // eslint-disable-next-line @typescript-eslint/ban-types
  injectType?: Function | Type<any>
  dependencyType: Type<T>
}

export interface ScannerClass extends ScannerModule {
  parentModule: ScannerModule
}

export interface ScannerMethod {
  handler: (...args: any[]) => any
  methodName: string
  parentClass: ScannerClass
}

export interface ScannerMethodWithMeta<T> {
  scannerMethod: ScannerMethod
  meta: T
}

export interface ScannerClassWithMeta<T> {
  scannerClass: ScannerClass
  meta: T
}

export type ScannerMetaKey = string | number | symbol

export type ScannerFilter<T> = (item: T) => boolean
