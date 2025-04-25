import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
	
	providedIn: 'root'

}) export class AuthGuard implements CanActivate{

	public constructor(private authService: AuthService, private router: Router) {}

	public canActivate(): Observable<boolean> {

		return this.authService.authState$.pipe(take(1),

			switchMap(async (user) => {

				if (!user) {

					this.authService.logout();
					this.router.navigate(['/']);
					return false;

				}
				
				const currentToken = await user.getIdToken();
				const storedToken = localStorage.getItem('access_token');
				
				if (currentToken !== storedToken){

					this.authService.logout();
					this.router.navigate(['/']);
					return false;

				}
				
				return true;

			})

		);

	}

}