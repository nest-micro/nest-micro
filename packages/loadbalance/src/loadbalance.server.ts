export class LoadbalanceServer {
  readonly id!: string
  readonly ip!: string
  readonly port!: number
  readonly name?: string
  readonly status?: boolean
  readonly weight?: number;
  readonly [index: string]: any
}
