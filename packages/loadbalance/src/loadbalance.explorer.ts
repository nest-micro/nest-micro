import { Injectable, OnModuleInit } from '@nestjs/common'
import { Scanner, ScannerClassWithMeta } from '@nest-micro/common'
import { RULES_METADATA } from './loadbalance.constants'
import { LoadbalanceRule } from './interfaces/rule.interface'
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry'
import { LoadbalanceRuleRegister } from './loadbalance-rule.register'

@Injectable()
export class LoadbalanceExplorer implements OnModuleInit {
  constructor(private readonly scanner: Scanner, private readonly ruleRegistry: LoadbalanceRuleRegistry) {}

  async onModuleInit() {
    await this.explore()
  }

  async explore() {
    const rules = await this.scanner.providersWithMetaAtKey<Function[]>(RULES_METADATA)
    rules.forEach((rule) => {
      this.lookupRules(rule)
    })
  }

  async lookupRules(rule: ScannerClassWithMeta<Function[]>) {
    const instance = rule.scannerClass.instance
    if (instance && instance instanceof LoadbalanceRuleRegister) {
      const rules = await this.scanner.injectablesInstanceWithDependencys<LoadbalanceRule>(rule.meta)
      rules.forEach((rule) => {
        this.ruleRegistry.addRule((rule as unknown as Function).constructor.name, rule)
      })
    }
  }
}
