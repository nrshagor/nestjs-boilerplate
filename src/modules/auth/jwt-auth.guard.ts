// auth/jwt-auth.guard.ts

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.log('Error or no user:', err, user, info); // Add this line for debugging
      throw err || new UnauthorizedException();
    }
    console.log('User from JwtAuthGuard:', user); // Add this line for debugging
    return user;
  }
}
