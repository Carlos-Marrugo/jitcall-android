import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { UserService } from '@core/services/user/user.service';
import { User } from '@entities/user.entity';

@Component({

	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	standalone: false

}) export class HeaderComponent implements OnInit, OnDestroy {

	@Input() public title: string = 'Page';
	@Input() public showBackButton: boolean = false;
	public user!: User | undefined;
	public isExpanded = false;

	public loggedUser$ = this.authService.loggedUser$;

	public constructor(

		private userService: UserService,
		private authService: AuthService,
		private router: Router,
		private location: Location

	) {}

	public ngOnInit(): void {

		this.loggedUser$.subscribe({

			next: (t) => {

				this.user = t;

			}, error: (e) => {console.log(e);}

		});

	}

	public ngOnDestroy(): void {}

	public async logout(): Promise<void> {

		await this.authService.logout();
		this.router.navigate(['/']);

	}

	public goBack(): void{

		this.location.back();

	}

	public toggleExpansion(event: Event): void {

		event.stopPropagation();
		this.isExpanded = !this.isExpanded;

	}

}