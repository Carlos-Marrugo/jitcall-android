import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { Credential } from '@models/credential.model';
import { SwalService } from '@shared/services/swal/swal.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { User } from '@entities/user.entity';

@Component({

	selector: 'app-logup',
	templateUrl: './logup.page.html',
	styleUrls: ['./logup.page.scss'],
	standalone: false

}) export class LogupPage implements OnInit {

	logupForm = this.fb.nonNullable.group({

		name: ['', Validators.required],
		surname: ['', Validators.required],
		email: ['', [Validators.required, Validators.email]],
		contact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
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

			if (this.logupForm.invalid) {

				this.logupForm.markAllAsTouched();
				throw new Error('Invalid Paramethers');

			}

			const email = this.logupForm.get('email')?.value;
			const password = this.logupForm.get('password')?.value;

			const name = this.logupForm.get('name')?.value;
			const surname = this.logupForm.get('surname')?.value;
			const contact = this.logupForm.get('contact')?.value;

			if (!email || !password || !name || !surname || !contact) {

				throw new Error('Invalid Paramethers');

			}

			const cred: Credential = {

				email: email,
				password: password

			};

			const user: User = {

				name: name,
				surname: surname,
				contact: contact,
				picture: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 131812794)}?v=4`//'https://ionicframework.com/docs/img/demos/avatar.svg'

			}

			this.authService.logup(cred, user).then((token: string) => {

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
