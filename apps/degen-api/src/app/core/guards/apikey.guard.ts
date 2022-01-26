import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppConfig } from '../../app.config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apikey = request.headers['x-api-key'];

    if (apikey) {
      // If verify doesn't throw an error than it is a valid signed token
      try {
        const token = jwt.verify(apikey, AppConfig.JWT_SECRET);
        request.apiKeyId = token.id;
        return true;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  }
}
