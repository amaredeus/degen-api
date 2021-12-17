import { CoreModule } from './core/code.module';
import { PoapModule } from './poap/poap.module';
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CoreModule, HealthModule, PoapModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
