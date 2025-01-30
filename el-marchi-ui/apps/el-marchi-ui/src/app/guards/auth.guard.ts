import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivate,
} from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '@features/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    return this.authService.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true; // Allow access to the route
        } else {
          // Redirect to the login page if not authenticated
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url }, // Pass the return URL
          });
          return false; // Deny access to the route
        }
      }),
    );
  }
}
