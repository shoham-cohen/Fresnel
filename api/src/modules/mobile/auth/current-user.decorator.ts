import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from './auth-user';
import type { AuthenticatedRequest } from './mobile-auth.guard';

// The user MobileAuthGuard put on the request. Use only on routes behind the guard.
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): AuthUser => {
  const user = context.switchToHttp().getRequest<AuthenticatedRequest>().user;
  if (!user) {
    throw new Error('CurrentUser used on a route without MobileAuthGuard');
  }
  return user;
});
