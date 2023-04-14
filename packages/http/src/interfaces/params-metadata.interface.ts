export interface ParamMetadata {
  data: string
  index: number
  value?: any
}

export type ParamsMetadata = Record<string, ParamMetadata>
