import { Injectable } from '@angular/core';
import { SweetAlertResult } from 'sweetalert2';
import Swal from 'sweetalert2';

@Injectable({

	providedIn: 'root'

}) export class SwalService {

	public constructor() {}

	public async showException(title: string, text: string): Promise<SweetAlertResult> {

		return await Swal.fire({

			title,
			text,
			icon: 'error',
			showCancelButton: false,
			confirmButtonColor: '#03fc5a',
			confirmButtonText: 'ok',
			heightAuto: false

		});

	}

	public async getConfirmation(title: string, text: string): Promise<SweetAlertResult> {

		return await Swal.fire({

			title,
			text,
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#03fc5a',
			confirmButtonText: 'yes',
			cancelButtonText: 'no',
			heightAuto: false

		});

	}

}