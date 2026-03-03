import {inject} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {from} from 'rxjs';
import {environment} from '../../environments/environment';

export const authAdminGuard = () => {
  const auth = inject(AuthService);

  return auth.isAuthenticated$.pipe( // if authenticated, check roles via JWT token
    filter((isAuthenticated) => isAuthenticated !== null),
    take(1),
    switchMap(() => from(auth.getAccessTokenSilently())),
    map((token) => {
      // atob == base64 decode of JWT token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles: string[] = payload[environment.auth0.roles_claim] || [];
      return roles.includes('admin');
    })
  );
};
