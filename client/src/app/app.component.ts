import {Component, inject} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {CommonModule} from '@angular/common';
import {LoginButtonComponent} from './auth/login-button.component';
import {LogoutButtonComponent} from './auth/logout-button.component';
import {ProfileComponent} from './auth/profile.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginButtonComponent, LogoutButtonComponent, ProfileComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public auth = inject(AuthService);
}
