import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from './request-with-user';
import { Roles } from './roles.enum';

@Injectable()
export class EmployeeRoleGuard implements CanActivate {
  private readonly employeeRole = 'employee';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const jwt = request.user;

    const userRoles: string[] =
      jwt?.['https://technology-radar.com/roles'] || [];

    if (userRoles.includes(Roles.ADMIN) || userRoles.includes(Roles.EMPLOYEE)) {
      return true;
    }

    throw new ForbiddenException(
      'Access denied - Admin or Employee role required',
    );
  }
}
