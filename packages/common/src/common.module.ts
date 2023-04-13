import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { Scanner } from './scanner'

@Module({
  imports: [DiscoveryModule],
  providers: [Scanner],
  exports: [Scanner],
})
export class CommonModule {}
