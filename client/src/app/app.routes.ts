import {Routes} from '@angular/router';
import {TechnologyRadarComponent} from './technology-radar/technology-radar.component';
import {AdministrationComponent} from './administration/administration.component';
import {AuthComponent} from './auth/auth.component';
import {authAdminGuard} from './auth/auth-admin.guard';
import {authGuard} from './auth/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: '/technology-radar', pathMatch: 'full'},
  {path: 'technology-radar', component: TechnologyRadarComponent, canActivate: [authGuard]},
  {path: 'auth', component: AuthComponent},
  {path: 'administration', component: AdministrationComponent, canActivate: [authGuard, authAdminGuard]},
  {
    path: '**',
    redirectTo: ''
  }
];
