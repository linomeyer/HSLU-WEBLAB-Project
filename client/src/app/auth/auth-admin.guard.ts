import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import {filter, map, switchMap, take} from 'rxjs/operators';

export const authAdminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    filter((isAuthenticated) => isAuthenticated !== null),
    take(1),
    switchMap(() => auth.idTokenClaims$),
    take(1),
    map((claims) => {
      const roles: string[] = claims?.['https://technology-radar.com/roles'] || []; // technology-radar.com is namespace not url
      const isAdmin = roles.includes('admin');

      console.log('Claims:', claims);
      console.log('Roles:', roles);
      console.log('Is Admin:', isAdmin);

      if (isAdmin) {
        return true;
      }

      router.navigate(['/technology-radar']);
      return false;
    })
  );
};
