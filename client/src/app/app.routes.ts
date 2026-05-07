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
		path: 'documents',
		canActivate: [authGuard],
		loadChildren: () => import('./documents/routes/documents.routes').then((m) => m.DOCUMENTS_ROUTES)
	},
	{
		path: 'workspace',
		pathMatch: 'full',
		redirectTo: 'documents/dashboard'
	},
	{
		path: '**',
		redirectTo: 'auth'
	}
];
