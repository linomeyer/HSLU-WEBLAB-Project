import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {from} from 'rxjs';

export const authAdminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe( // if authenticated, check roles via JWT token
    filter((isAuthenticated) => isAuthenticated !== null),
    take(1),
    switchMap(() => from(auth.getAccessTokenSilently())),
    map((token) => {
      // atob == base64 decode of JWT token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles: string[] = payload['https://technology-radar.com/roles'] || [];
      const isAdmin = roles.includes('admin');

      if (isAdmin) {
        return true;
      }

      router.navigate(['/administration']);
      return false;
    })
  );
};
