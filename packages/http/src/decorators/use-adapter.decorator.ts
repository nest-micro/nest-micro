import { AxiosAdapter } from 'axios'
import { ExtendArrayMetadata } from '@nest-micro/common'
import { ADAPTER_METADATA } from '../http.constants'

export const UseAdapters = (...adapters: AxiosAdapter[]) => {
  return ExtendArrayMetadata(ADAPTER_METADATA, adapters)
}
