import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { TypegooseHealthIndicator } from './typegoose-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private typegooseHealthIndicator: TypegooseHealthIndicator
  ) {}

  @ApiOperation({
    description: 'Healthcheck Endpoint',
  })
  @HealthCheck()
  @Get()
  check(@Req() req) {
    return this.health.check([() => this.typegooseHealthIndicator.ping()]);
  }
}
