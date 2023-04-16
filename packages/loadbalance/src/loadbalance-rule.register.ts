import { RandomRule } from './rules/random.rule'
import { RoundRobinRule } from './rules/round-robin.rule'

export const LoadbalanceRuleRegister = [RandomRule, RoundRobinRule]
