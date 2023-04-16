import { SetMetadata } from '@nestjs/common'
import { REGISTER_ADAPTER_METADATA } from '../http.constants'

export const RegisterAdapter = () => {
  return SetMetadata(REGISTER_ADAPTER_METADATA, true)
}
