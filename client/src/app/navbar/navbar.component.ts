import {Component, inject, Signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {AuthService} from '@auth0/auth0-angular';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map, switchMap} from 'rxjs/operators';
import {from, of} from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIcon,
    RouterLink,
    MatButton,
    MatIconButton
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  isAdmin: Signal<boolean> = toSignal(
    this.auth.isAuthenticated$.pipe(
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
      })
    ),
    {initialValue: false}
  );

  goToAdministration(): void {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/administration']);
      } else {
        this.auth.loginWithRedirect({
          authorizationParams: {
            redirect_uri: `${window.location.origin}/administration`
          }
        });
      }
    });
  }

  handleProfileClick(): void {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/auth');
      } else {
        this.auth.loginWithRedirect({
          appState: {target: '/auth'}
        });
      }
    });
  }
}
