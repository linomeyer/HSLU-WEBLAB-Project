import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Injectable()
export class AdminRoleGuard implements CanActivate {
  private readonly adminRole = 'admin';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const jwt = request.user;

    const userRoles: string[] =
      jwt?.['https://technology-radar.com/roles'] || [];

    const hasRole = userRoles.includes(this.adminRole);

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
