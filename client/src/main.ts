import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {mergeApplicationConfig} from '@angular/core';
import {provideAuth0} from '@auth0/auth0-angular';
import {environment} from './environments/environment';


const auth0Config = mergeApplicationConfig(appConfig, {
  providers: [
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  ]
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
