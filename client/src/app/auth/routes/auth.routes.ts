import { Routes } from '@angular/router';

/**
 * Instead of defining the routes directly in the app.routes.ts 
 * file, we can define them here and then import them in 
 * the app.routes.ts file. This way, we can keep our routes 
 * organized and modular, lazy loading.
 */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/login/login.page').then((m) => m.LoginPageComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../pages/register/register.page').then((m) => m.RegisterPageComponent)
  }
];
