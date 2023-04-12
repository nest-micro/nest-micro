import { Injectable } from '@nestjs/common'
import { IBrakes } from './interfaces/brakes.interface'

@Injectable()
export class BrakesRegistry {
  private readonly brakes = new Map<string, IBrakes>()

  addBrakes(name: string, brakes: IBrakes) {
    this.brakes.set(name, brakes)
  }

  getBrakes(name: string) {
    return this.brakes.get(name)
  }
}
