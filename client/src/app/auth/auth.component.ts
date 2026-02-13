import {Component, inject} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {CommonModule} from '@angular/common';
import {LoginButtonComponent} from './login-button.component';
import {LogoutButtonComponent} from './logout-button.component';
import {ProfileComponent} from './profile.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'auth',
  standalone: true,
  imports: [CommonModule, LoginButtonComponent, LogoutButtonComponent, ProfileComponent, RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  public auth = inject(AuthService);
}
