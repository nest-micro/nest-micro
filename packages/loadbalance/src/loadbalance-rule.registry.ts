import { Injectable } from '@nestjs/common'
import { LoadbalanceRule } from './interfaces/rule.interface'

@Injectable()
export class LoadbalanceRuleRegistry {
  private readonly rules = new Map<string, LoadbalanceRule>()
  private readonly callbacks: Function[] = []

  watch(callback: () => void) {
    this.callbacks.push(callback)
  }

  addRule(name: string, rule: LoadbalanceRule) {
    if (this.rules.has(name)) return
    this.rules.set(name, rule)
    this.callbacks.forEach((callback) => callback())
  }

  getRule(name: string): LoadbalanceRule | undefined {
    return this.rules.get(name)
  }
}
