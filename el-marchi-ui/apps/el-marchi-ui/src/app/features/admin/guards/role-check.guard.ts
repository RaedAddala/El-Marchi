import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@features/auth/auth.service';
import { map, catchError, of } from 'rxjs';

export const roleCheckGuard: CanActivateFn = (next: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authorities = next.data['authorities'] as string[];

  // Check authentication status
  authService.checkAuthentication();

  // If no user data is available, redirect to login
  if (!authService.getConnectedUser()) {
    router.navigate(['/login']); // Redirect to login page
    return of(false); // Deny access
  }

  // Check if the user has the required authorities
  return authService.user$.pipe(
    map(user => {
      if (!user) {
        router.navigate(['/login']); // Redirect to login page
        return false; // Deny access
      }

      // Check if the user has the required authorities
      const hasAccess =
        !authorities ||
        authorities.length === 0 ||
        authService.hasAnyAuthorities(user, authorities);

      if (!hasAccess) {
        router.navigate(['/404']); // Redirect to unauthorized page
        return false; // Deny access
      }

      return true; // Grant access
    }),
    catchError(() => {
      router.navigate(['/login']); // Redirect to login page on error
      return of(false); // Deny access
    }),
  );
};
