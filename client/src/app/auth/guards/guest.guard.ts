import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthStorageService } from '../services/auth-storage.service';
import { selectToken } from '../store/auth.selectors';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const storage = inject(AuthStorageService);
  const router = inject(Router);

  const token = store.selectSignal(selectToken)();
  if (token || storage.hasValidSession()) {
    return router.createUrlTree(['/workspace']);
  }
  return true;
};
