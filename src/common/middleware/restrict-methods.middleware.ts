import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RestrictMethodsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const specificDomains = ['*'];

    // Check the origin or host of the request
    const origin = req.headers.origin;
    const host = req.headers.host;

    if (req.method === 'GET') {
      // Allow GET for all domains
      next();
    } else {
      if (
        (origin && specificDomains.some((domain) => origin.includes(domain))) ||
        (host && specificDomains.some((domain) => host.includes(domain)))
      ) {
        // Allow POST, PATCH, DELETE for the specific domains
        next();
      } else {
        // Block POST, PATCH, DELETE for other domains
        throw new HttpException(
          'Method Not Allowed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }
    }
  }
}
