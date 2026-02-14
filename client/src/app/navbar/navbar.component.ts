import {Component, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {AuthService} from '@auth0/auth0-angular';

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
