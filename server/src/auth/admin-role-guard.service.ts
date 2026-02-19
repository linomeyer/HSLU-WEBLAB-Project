import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const jwt = context.switchToHttp().getRequest<JwtPayload>();

    const userRoles: string[] =
      jwt?.['https://technology-radar.com/roles'] || [];

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
