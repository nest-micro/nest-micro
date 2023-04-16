import { applyDecorators } from '@nestjs/common'
import { ExtendArrayMetadata, GUARDS_METADATA } from '@nest-micro/common'
import { LoadbalanceRule } from '../interfaces/rule.interface'
import { RULES_METADATA } from '../loadbalance.constants'

export const UseRules = (...rules: (LoadbalanceRule | Function)[]) => {
  return applyDecorators(ExtendArrayMetadata(RULES_METADATA, rules), ExtendArrayMetadata(GUARDS_METADATA, rules))
}
