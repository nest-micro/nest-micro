import { applyDecorators } from '@nestjs/common'
import { ExtendArrayMetadata, GUARDS_METADATA } from '@nest-micro/common'
import { ProxyFilter } from '../interfaces/filter.interface'
import { FILTERS_METADATA } from '../proxy.constants'

export const UseFilters = (...rules: (ProxyFilter | Function)[]) => {
  return applyDecorators(ExtendArrayMetadata(FILTERS_METADATA, rules), ExtendArrayMetadata(GUARDS_METADATA, rules))
}
