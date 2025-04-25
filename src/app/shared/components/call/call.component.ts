import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CallService } from '@shared/services/call/call.service';
import { Contact } from '@entities/contact.entity';
import { Observable } from 'rxjs';

@Component({

	selector: 'app-call',
	templateUrl: './call.component.html',
	styleUrls: ['./call.component.scss'],
	standalone: false

}) export class CallComponent implements OnInit {

	@ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;

	public isCalling$: Observable<boolean> = this.callService.isCalling$;
	public callType$: Observable<boolean> = this.callService.callType$;
	public contact: Observable<Contact | null> = this.callService.inComingContact$;

	public callType!: boolean;

	public constructor(private callService: CallService) {}

	public ngOnInit(): void {

		this.callType$.subscribe({

			next: (t) => {

				this.callType = t;

				if (t) this.setupLocalVideo();

			}, error: (e) => console.log(e)

		});

	}

	private async setupLocalVideo(): Promise<void> {

		try {

			const stream = await navigator.mediaDevices.getUserMedia({

				video: this.callType,
				audio: true

			});
			
			if (this.localVideo?.nativeElement) {

				this.localVideo.nativeElement.srcObject = stream;

			}

		}catch (error){

			console.error('Error:', error);

		}

	}

	public toggleCallType(): void {

		this.callService.setCallType(!this.callType);

	}

	public hangUp(): void {

		this.callService.hangUp();

	}

}