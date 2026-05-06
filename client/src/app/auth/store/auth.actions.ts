import { createAction, props } from '@ngrx/store';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.models';

export const login = createAction('[Auth Page] Login', props<{ request: LoginRequest }>());

export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction('[Auth API] Login Failure', props<{ error: string }>());

export const register = createAction('[Auth Page] Register', props<{ request: RegisterRequest }>());

export const registerSuccess = createAction('[Auth API] Register Success');

export const registerFailure = createAction(
  '[Auth API] Register Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const authActions = {
  login,
  loginSuccess,
  loginFailure,
  register,
  registerSuccess,
  registerFailure,
  logout
};
