import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { Credential } from '@models/credential.model';

@Component({

	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	standalone: false

}) export class LoginPage implements OnInit {

	loginForm = this.fb.group({

		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required]]

	});

	public constructor(

		private fb: FormBuilder,
		private authService: AuthService,
		private swalService: SwalService,
		private loadingService: LoadingService,
		private router: Router

	) {}

	public ngOnInit(): void {}

	public onSubmit(): void {

		this.loadingService.show();

		try{

			if (this.loginForm.invalid) {

				this.loginForm.markAllAsTouched();
				throw new Error('Invalid Paramethers');

			}

			const email = this.loginForm.get('email')?.value;
			const password = this.loginForm.get('password')?.value;

			if (!email || !password) {

				throw new Error('Invalid Paramethers');

			}

			const cred: Credential = {

				email: email,
				password: password

			};

			this.authService.login(cred).then((token: string) => {

				localStorage.setItem('access_token', token);
				this.router.navigate(['/home']);

			}).catch((e: any) => {

				this.swalService.showException('Error', e.message);

			});

		}catch (e: any){

			this.swalService.showException('Error', e.message);

		}

		this.loadingService.hide();

	}

}
