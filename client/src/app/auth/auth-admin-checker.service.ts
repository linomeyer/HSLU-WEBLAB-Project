import {inject, Injectable, Signal} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map, shareReplay, switchMap} from 'rxjs/operators';
import {from, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminCheckerService {
  private auth = inject(AuthService);

  private isAdmin$ = this.auth.isAuthenticated$.pipe(
    filter(isAuthenticated => isAuthenticated !== null),
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return of(false);
      }
      return from(this.auth.getAccessTokenSilently()).pipe(
        map(token => {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const roles: string[] = payload['https://technology-radar.com/roles'] || [];
          return roles.includes('admin');
        })
      );
    }),
    shareReplay(1) // Cache the result
  );

  readonly isAdmin: Signal<boolean> = toSignal(this.isAdmin$, {
    initialValue: false
  });
}
