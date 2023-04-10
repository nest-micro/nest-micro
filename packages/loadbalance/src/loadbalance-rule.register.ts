import { Injectable } from '@nestjs/common'
import { RandomRule } from './rules/random.rule'
import { RoundRobinRule } from './rules/round-robin.rule'
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry'

@Injectable()
export class LoadbalanceRuleRegister {
  constructor(private readonly loadbalanceRuleRegistry: LoadbalanceRuleRegistry) {
    this.loadbalanceRuleRegistry.addRule(RandomRule.name, new RandomRule())
    this.loadbalanceRuleRegistry.addRule(RoundRobinRule.name, new RoundRobinRule())
  }
}
