import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from './request-with-user';
import { Roles } from './roles.enum';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const jwt = request.user;

    const userRoles: string[] =
      jwt?.['https://technology-radar.com/roles'] || [];

    const hasRole = userRoles.includes(Roles.ADMIN);

    if (!hasRole) {
      throw new ForbiddenException('Access denied - Admin role required');
    }

    return true;
  }
}
