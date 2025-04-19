import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon,
  IonFab, IonFabButton, IonButtons } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { JitsiMeetService } from '../core/services/jitsi.meet.service';



@Component({
  selector: 'app-llamada',
  templateUrl: './llamada.page.html',
  styleUrls: ['./llamada.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton,  IonHeader, IonToolbar, IonTitle, IonContent, 
      IonButton, IonIcon,
    IonFab, IonFabButton, IonButtons]
})
export class LlamadaPage implements OnInit, OnDestroy {
  meetingId!: string;
  esIniciador!: boolean;
  nombreContacto!: string;
  jitsiUrl!: string;

  constructor(
    private jitsiService: JitsiMeetService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.meetingId = params.get('id') || '';
      
      const navigation = this.router.getCurrentNavigation();
      const state = navigation?.extras.state as {
        esIniciador: boolean;
        nombreContacto: string;
      };

      if (state) {
        this.esIniciador = state.esIniciador;
        this.nombreContacto = state.nombreContacto;
      }

      this.iniciarLlamada();
    });
  }

  iniciarLlamada() {
    const roomName = `jitCall-${this.meetingId}`;
    const userInfo = {
      displayName: this.esIniciador ? 'Iniciador' : 'Invitado'
    };

    this.jitsiService.iniciarLlamada(roomName, userInfo);
  }

  finalizarLlamada() {
    this.jitsiService.finalizarLlamada();
    this.router.navigate(['/home']);
  }
}