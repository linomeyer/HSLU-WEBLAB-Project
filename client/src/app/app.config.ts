import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAuth0} from '@auth0/auth0-angular';
import {environment} from '../environments/environment';
import {provideHttpClient} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.auth0.audience,
      },
      httpInterceptor: { // interceptor is not needed for GET Request, GET is always allowed
        allowedList: [
          {
            uri: '/api/technology*',
            httpMethod: 'POST',
          },
          {
            uri: '/api/technology*',
            httpMethod: 'PUT',
          },
          {
            uri: '/api/technology*',
            httpMethod: 'DELETE',
          },
        ]
      }
    }),
  ]
};
