import { Component } from '@angular/core';
import { SwalService } from '@shared/services/swal/swal.service';
import { CapacitorService } from '@core/services/capacitor/capacitor.service';

@Component({

	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
	standalone: false

}) export class AppComponent {

	public constructor(private capacitorService: CapacitorService, private swalService: SwalService) {

		this.capacitorService.notificationReceived$.subscribe({

			next: (t) => {

				

			}, error: (e) => this.swalService.showException('Error', e.message)

		});

	}

}
