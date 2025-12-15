import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

export const guestGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  // Wait for auth initialization to complete
  if (authState.isLoading()) {
    return new Promise<boolean | import('@angular/router').UrlTree>((resolve) => {
      const checkAuth = () => {
        if (!authState.isLoading()) {
          if (!authState.isAuthenticated()) {
            resolve(true);
          } else {
            resolve(router.createUrlTree(['/dashboard']));
          }
        } else {
          setTimeout(checkAuth, 50);
        }
      };
      checkAuth();
    });
  }

  if (!authState.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};

