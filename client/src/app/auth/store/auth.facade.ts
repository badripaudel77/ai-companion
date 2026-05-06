import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginRequest, RegisterRequest } from '../models/auth.models';
import { authActions } from './auth.actions';
import { selectError, selectLoading, selectToken, selectUser } from './auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(selectUser);
  readonly token = this.store.selectSignal(selectToken);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly isAuthenticated = computed(() => !!this.token());

  login(request: LoginRequest): void {
    this.store.dispatch(authActions.login({ request }));
  }

  register(request: RegisterRequest): void {
    this.store.dispatch(authActions.register({ request }));
  }

  logout(): void {
    this.store.dispatch(authActions.logout());
  }
}
