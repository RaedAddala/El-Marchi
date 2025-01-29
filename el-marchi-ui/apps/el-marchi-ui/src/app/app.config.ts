import {ApplicationConfig} from '@angular/core';
//import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient} from "@angular/common/http";
import {AuthInterceptor} from "./auth-interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    //provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Allow multiple interceptors
    },

  ],
};
