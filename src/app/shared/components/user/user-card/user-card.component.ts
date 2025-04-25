import { Component, OnInit, Input } from '@angular/core';
import { User } from '@entities/user.entity';

@Component({

	selector: 'app-user-card',
	templateUrl: './user-card.component.html',
	styleUrls: ['./user-card.component.scss'],
	standalone: false

}) export class UserCardComponent implements OnInit {

	@Input({

		required: true

	}) user!: User;

	public constructor() {}

	public ngOnInit(): void {}

}
