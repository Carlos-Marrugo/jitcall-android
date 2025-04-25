import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth/auth.guard';

const routes: Routes = [

	{

		path: 'login',
		loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)

	}, {

		path: '',
		redirectTo: 'login',
		pathMatch: 'full'

	}, {

		path: 'logup',
		loadChildren: () => import('./pages/auth/logup/logup.module').then( m => m.LogupPageModule)

	}, {

		path: 'home',
		loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
		canActivate: [AuthGuard]

	}, {

		path: 'add',
		loadChildren: () => import('./pages/contact/contact-insert-form/contact-insert-form.module').then( m => m.ContactInsertFormPageModule),
		canActivate: [AuthGuard]

	}, {

		path: 'update/:id',
		loadChildren: () => import('./pages/contact/contact-update-form/contact-update-form.module').then( m => m.ContactUpdateFormPageModule),
		canActivate: [AuthGuard]

	},


];

@NgModule({

	imports: [

		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })

	], exports: [RouterModule]

}) export class AppRoutingModule { }
