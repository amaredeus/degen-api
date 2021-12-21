import * as winston from 'winston';
import { LocalWinstonFormatter } from './winston-local.formatter';

// TODO: Use logdna transport in non-local envs as necessary
export const winstonOptionsFactory = () => ({
  level: 'debug',
  format:
    process.env.NODE_ENV === 'development'
      ? winston.format.combine(
          winston.format.timestamp(),
          LocalWinstonFormatter()
        )
      : winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
  transports: [new winston.transports.Console()],
});
