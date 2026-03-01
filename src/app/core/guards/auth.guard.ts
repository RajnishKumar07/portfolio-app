import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Example basic check, real implementation will verify token with backend
  if (authService.isAuthenticated()) {
    return true;
  }

  return router.navigate(['/login']);
};
