/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

/**
 * 创建空日志函数以实现日志禁用
 */
export class NoopLogger {
  static log(...args: any) {}
  static info(...args: any) {}
  static warn(...args: any) {}
  static error(...args: any) {}
  static debug(...args: any) {}
  static table(...args: any) {}
}
