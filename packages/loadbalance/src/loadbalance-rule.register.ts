import { Injectable } from '@nestjs/common'
import { RandomRule } from './rules/random.rule'
import { RoundRobinRule } from './rules/round-robin.rule'
import { UseRules } from './decorators/use-rules.decorator'

@Injectable()
@UseRules(RandomRule, RoundRobinRule)
export class LoadbalanceRuleRegister {}
