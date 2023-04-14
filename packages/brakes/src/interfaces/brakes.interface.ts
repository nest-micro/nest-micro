import { FactoryProvider } from '@nestjs/common'

export interface IBrakes {
  /**
   * Returns a reference to the global stats tracker
   */
  getGlobalStats(): any

  /**
   * Executes the circuit
   */
  exec(): Promise<any>

  /**
   * Registers a fallback function for the circuit
   */
  fallback(callback: Function): void

  /**
   * Registers a health check function for the circuit
   */
  healthCheck(callback: Function): void

  /**
   * Create a new sub circuit that rolls up into the main circuit it is created under.
   */
  subCircuit(method: Function, fallback?: Function, options?: BrakesOptions): ICircuit

  /**
   * Register an event listener
   */
  on(event: 'exec', handler: (data: any) => void): void

  on(event: 'success', handler: (data: any) => void): void

  on(event: 'timeout', handler: (data: any, e: Error, exec: Function) => void): void

  on(event: 'failure', handler: (data: any, e: Error, exec: Function) => void): void

  on(event: 'snapshot', handler: (snapshot: any) => void): void

  on(event: 'circuitClosed', handler: () => void): void

  on(event: 'circuitOpen', handler: () => void): void

  on(event: 'healthCheckFailed', handler: (e: Error) => void): void

  /**
   * Removes all listeners and deregisters with global stats tracker.
   */
  destroy(): void

  /**
   * Returns true if circuit is open
   */
  isOpen(): true
}

export interface ICircuit {
  /**
   * Executes the circuit
   */
  exec(): Promise<any>

  /**
   * Registers a fallback function for the circuit
   */
  fallback(callback: Function): void
}

export interface BrakesOptions {
  /**
   * to use for name of circuit. This is mostly used for reporting on stats.
   * @default 'defaultBrake'
   */
  name?: string

  /**
   * to use for group of circuit. This is mostly used for reporting on stats.
   * @default 'defaultBrakeGroup'
   */
  group?: string

  /**
   * time in ms that a specific bucket should remain active
   * @default 1000
   */
  bucketSpan?: number

  /**
   * interval in ms that brakes should emit a snapshot event
   * @default 1200
   */
  statInterval?: number

  /**
   * that defines the percentile levels that should be calculated on the stats object (i.e. 0.9 for 90th percentile)
   * @default [0.0, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99, 0.995, 1]
   */
  percentiles?: number[]

  /**
   * of buckets to retain in a rolling window
   * @default 60
   */
  bucketNum?: number

  /**
   * time in ms that a circuit should remain broken
   * @default 30000
   */
  circuitDuration?: number

  /**
   * number of requests to wait before testing circuit health
   * @default 100
   */
  waitThreshold?: number

  /**
   * % threshold for successful calls. If the % of successful calls dips below this threshold the circuit will break
   * @default 0.5
   */
  threshold?: number

  /**
   * time in ms before a service call will timeout
   * @default 15000
   */
  timeout?: number

  /**
   * that returns true if an error should be considered a failure (receives the error object returned by your command.) This allows for non-critical errors to be ignored by the circuit breaker
   */
  isFailure?: (error: Error) => boolean

  /**
   * time in ms interval between each execution of health check function
   * @default 5000
   */
  healthCheckInterval?: number

  /**
   * to call for the health check (can be defined also with calling healthCheck function)
   */
  healthCheck?: Function

  /**
   * to call for fallback (can be defined also with calling fallback function)
   */
  fallback?: Function

  /**
   * to opt out of check for callback in function. This affects the passed in function, health check and fallback
   * @default false
   */
  isPromise?: boolean

  /**
   * to opt out of check for callback, always promisifying in function. This affects the passed in function, health check and fallback
   * @default false
   */
  isFunction?: boolean

  /**
   * modifies the error message by adding circuit name.
   * @default true
   */
  modifyError?: boolean
}

export interface BrakesAsyncOptions {
  name?: string
  useFactory?: (...args: any[]) => Promise<BrakesOptions> | BrakesOptions
  inject?: FactoryProvider['inject']
  dependencies?: FactoryProvider['inject']
}
