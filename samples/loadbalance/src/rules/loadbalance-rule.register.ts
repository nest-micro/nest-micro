import { Injectable } from '@nestjs/common'
import { UseRules, LoadbalanceRuleRegister } from '@nest-micro/loadbalance'
import { FirstRule } from './first.rule'

@Injectable()
@UseRules(FirstRule)
export class LoadbalanceGlobalRuleRegister extends LoadbalanceRuleRegister {}
