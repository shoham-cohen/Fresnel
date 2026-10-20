import { Reflector } from '@nestjs/core';

// The user needs at least one of these client roles (resource_access[clientId].roles). Checked by AuthGuard.
// Usage: @Roles(['editor']) on a controller or a route.
export const Roles = Reflector.createDecorator<string[]>();
