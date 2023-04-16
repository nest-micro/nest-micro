import { Injectable, OnModuleInit } from '@nestjs/common'
import { Scanner, ScannerClassWithMeta } from '@nest-micro/common'
import { REGISTER_RULES_METADATA } from './loadbalance.constants'
import { LoadbalanceRule } from './interfaces/rule.interface'
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry'

@Injectable()
export class LoadbalanceExplorer implements OnModuleInit {
  constructor(private readonly scanner: Scanner, private readonly ruleRegistry: LoadbalanceRuleRegistry) {}

  async onModuleInit() {
    await this.explore()
  }

  async explore() {
    const rules = await this.scanner.providersWithMetaAtKey<Function[]>(REGISTER_RULES_METADATA)
    rules.forEach((rule) => {
      this.lookupRules(rule)
    })
  }

  async lookupRules(rule: ScannerClassWithMeta<Function[]>) {
    const instance = rule.scannerClass.instance as LoadbalanceRule
    const name = instance.name || instance.constructor.name
    this.ruleRegistry.addRule(name, instance as LoadbalanceRule)
  }
}
