import { Inject, Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicator,
  HealthCheckError,
} from '@nestjs/terminus';
import { mongoose } from '@typegoose/typegoose';
import { getConnectionToken } from 'nestjs-typegoose';

@Injectable()
export class TypegooseHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(getConnectionToken()) private connection: mongoose.Connection
  ) {
    super();
  }

  async ping(key = 'mongodb'): Promise<HealthIndicatorResult> {
    try {
      if (this.connection.readyState === 1) {
        return super.getStatus(key, true);
      } else {
        const status = super.getStatus(key, false, {
          message: `Mongo connection readyState is: ${this.connection.readyState}`,
        });
        throw new HealthCheckError('Unable to connect to database', status);
      }
    } catch (err) {
      const status = super.getStatus(key, false, {
        message: `Mongo connection readyState is: ${this.connection.readyState}`,
      });
      throw new HealthCheckError('Unable to connect to database', status);
    }
  }
}
