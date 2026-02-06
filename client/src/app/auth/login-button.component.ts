import {Component, inject} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-button',
  standalone: true,
  template: `
    <button
      (click)="loginWithRedirect()"
      class="button login"
    >
      Log In
    </button>
  `,
  styleUrls: ['../app.component.css']
})
export class LoginButtonComponent {
  private auth = inject(AuthService);

  loginWithRedirect(): void {
    this.auth.loginWithRedirect();
  }
}
