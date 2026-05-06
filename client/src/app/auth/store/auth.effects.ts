import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';
import { AuthStorageService } from '../services/auth-storage.service';
import { AuthResponse, User } from '../models/auth.models';
import { authActions } from './auth.actions';

function mapUser(response: AuthResponse, fullname?: string): User {
  return {
    fullname,
    email: response.username,
    role: response.role
  };
}

function getErrorMessage(error: unknown): string {
  const httpError = error as { error?: { message?: string }; message?: string };
  return httpError.error?.message ?? httpError.message ?? 'Authentication failed. Please try again.';
}

export const login$ = createEffect(
  (
    actions$ = inject(Actions),
    authApi = inject(AuthApiService),
    storage = inject(AuthStorageService)
  ) =>
    actions$.pipe(
      ofType(authActions.login),
      switchMap(({ request }) =>
        authApi.login(request).pipe(
          map((response) => {
            if (!response.token) {
              return authActions.loginFailure({ error: 'Missing JWT token from the server.' });
            }
            const user = mapUser(response);
            storage.saveSession(response, user);

            return authActions.loginSuccess({
              user,
              token: response.token
            });
          }),
          catchError((error) => of(authActions.loginFailure({ error: getErrorMessage(error) })))
        )
      )
    ),
  { functional: true }
);

export const loginNavigate$ = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(authActions.loginSuccess),
      tap(() => {
        router.navigate(['/workspace']);
      })
    ),
  { functional: true, dispatch: false }
);

export const register$ = createEffect(
  (
    actions$ = inject(Actions),
    authApi = inject(AuthApiService)
  ) =>
    actions$.pipe(
      ofType(authActions.register),
      switchMap(({ request }) =>
        authApi.register(request).pipe(
          map(() => authActions.registerSuccess()),
          catchError((error) => of(authActions.registerFailure({ error: getErrorMessage(error) })))
        )
      )
    ),
  { functional: true }
);

export const registerRedirect$ = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(authActions.registerSuccess),
      tap(() => {
        router.navigate(['/auth/login'], {
          queryParams: { registered: 'true' }
        });
      })
    ),
  { functional: true, dispatch: false }
);

export const logout$ = createEffect(
  (
    actions$ = inject(Actions),
    storage = inject(AuthStorageService),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(authActions.logout),
      tap(() => {
        storage.clearSession();
        router.navigate(['/auth/login']);
      })
    ),
  { functional: true, dispatch: false }
);
