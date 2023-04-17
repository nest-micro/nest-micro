import { SetMetadata } from '@nestjs/common'
import { REGISTER_FILTERS_METADATA } from '../proxy.constants'

export const RegisterFilter = () => {
  return SetMetadata(REGISTER_FILTERS_METADATA, true)
}
