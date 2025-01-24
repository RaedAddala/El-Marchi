import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@features/auth/auth.service';
import { map, timeout } from 'rxjs';

export const roleCheckGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const authorities = next.data['authorities'] as string[];

  // Check authentication status
  authService.checkAuthentication();

  // Fetch user data if not already cached
  if (!authService.getConnectedUser()) {
    authService.fetch().subscribe();
  }

  return authService.user$.pipe(
    map((user) => {
      if (!user) {
        return false; // Deny access if user data is not available
      }

      // Check if the user has the required authorities
      const hasAccess =
        !authorities ||
        authorities.length === 0 ||
        authService.hasAnyAuthorities(user, authorities);

      if (!hasAccess) {
        authService.logout(); // Log out the user if they don't have access
        return false;
      }

      return true; // Grant access
    }),
    timeout(3000) // Timeout after 3 seconds
  );
};
