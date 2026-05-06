import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthResponse, User } from '../models/auth.models';
import { authActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

const authReducer = createReducer(
  initialAuthState,
  on(authActions.login, authActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(authActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null
  })),
  on(authActions.loginFailure, authActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(authActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(authActions.logout, () => ({
    ...initialAuthState
  }))
);

export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer
});

export const {
  selectAuthState,
  selectUser,
  selectToken,
  selectLoading,
  selectError
} = authFeature;
