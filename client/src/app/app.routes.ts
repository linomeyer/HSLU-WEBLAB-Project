import {Routes} from '@angular/router';
import {TechnologyRadarComponent} from './technology-radar/technology-radar.component';
import {AdministrationComponent} from './administration/administration.component';
import {AuthComponent} from './auth/auth.component';

export const routes: Routes = [
  {path: '', redirectTo: '/technology-radar', pathMatch: 'full'},
  {path: 'technology-radar', component: TechnologyRadarComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'administration', component: AdministrationComponent}
];
