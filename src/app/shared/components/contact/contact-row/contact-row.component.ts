import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '@entities/contact.entity';
import { User } from '@entities/user.entity';
import { Router } from '@angular/router';

@Component({

	selector: 'app-contact-row',
	templateUrl: './contact-row.component.html',
	styleUrls: ['./contact-row.component.scss'],
	standalone: false

}) export class ContactRowComponent	implements OnInit {

	@Input({

		required: true

	}) public contact!: Contact;

	public isExpanded = false;

	public constructor(private router: Router) {}

	public ngOnInit(): void {}

	public navigateToUpdate(event: Event): void {

		event.stopPropagation();
		this.router.navigate(['/update', this.contact.id]);

	}

	public toggleExpansion(event: Event): void {

		event.stopPropagation();
		this.isExpanded = !this.isExpanded;

	}

}
