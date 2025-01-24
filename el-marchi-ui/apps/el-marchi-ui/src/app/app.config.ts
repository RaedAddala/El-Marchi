import {ApplicationConfig} from '@angular/core';
//import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    //provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(),

  ],
};
