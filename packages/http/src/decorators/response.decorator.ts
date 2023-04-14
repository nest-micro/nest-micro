import { SetMetadata } from '@nestjs/common'
import { ExtendMetadata } from '@nest-micro/common'
import { RESPONSE_METADATA, REQUEST_OPTIONS_METADATA } from '../http.constants'

export const Response = (field?: string) => {
  return SetMetadata(RESPONSE_METADATA, field)
}

export const ResponseBody = () => {
  return SetMetadata(RESPONSE_METADATA, 'data')
}

export const ResponseType = (type: string) => {
  return ExtendMetadata(REQUEST_OPTIONS_METADATA, { responseType: type })
}

export const ResponseEncode = (encoding: string) => {
  return ExtendMetadata(REQUEST_OPTIONS_METADATA, { responseEncoding: encoding })
}
