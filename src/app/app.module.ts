import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptors/auth/auth.interceptor';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({

	declarations: [

		AppComponent

	], imports: [

		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		CoreModule

	], providers: [

		{

			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy

		}, {

			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true

		}
	
	], bootstrap: [

		AppComponent

	]

}) export class AppModule {}
