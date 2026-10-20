import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// The user from the Keycloak token, set by AuthGuard.
export interface AuthenticatedUser {
  id: string; // sub: stable Keycloak user id
  username: string;
  fullName: string;
  type?: string;
  compartments: string[];
  roles: string[];
}

// Usage: create(@CurrentUser() user: AuthenticatedUser). Only on routes behind AuthGuard.
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<Request & { user: AuthenticatedUser }>().user,
);
