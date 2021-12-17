import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypegooseHealthIndicator } from './typegoose-health.indicator';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [TypegooseHealthIndicator],
})
export class HealthModule {}
