import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from './request-with-user';
import { Roles } from './roles.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  @Inject()
  private configService: ConfigService;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const jwt = request.user;

    const claim = this.configService.get<string>('AUTH0_ROLES_CLAIM');
    if (!claim) {
      throw new Error(
        'AUTH0_ROLES_CLAIM is not defined in Auth0 configuration. Please check your .env file.',
      );
    }

    const userRoles: string[] = (jwt?.[claim] as string[] | undefined) || [];

    const hasRole = userRoles.includes(Roles.ADMIN);

    if (!hasRole) {
      throw new ForbiddenException('Access denied - Admin role required');
    }

    return true;
  }
}
