import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'auth'
	},
	{
		path: 'auth',
		loadChildren: () => import('./auth/routes/auth.routes').then((m) => m.AUTH_ROUTES)
	},
	{
		path: 'workspace',
		canActivate: [authGuard],
		loadComponent: () =>
			import('./auth/pages/workspace/workspace.page').then((m) => m.WorkspacePageComponent)
	},
	{
		path: '**',
		redirectTo: 'auth'
	}
];
