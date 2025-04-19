import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ContactosService } from 'src/app/core/services/contacto.service';
import { Observable, tap } from 'rxjs';
import { NotificacionesService } from 'src/app/core/services/notificaciones.service';

@Component({
  selector: 'app-solicitudes-pendientes',
  templateUrl: './solicitudes-pendientes.component.html',
  styleUrls: ['./solicitudes-pendientes.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class SolicitudesPendientesComponent implements OnInit {

  solicitudes: any[] = []; 

  async rechazarSolicitud(solicitudId: string) {
    await this.contactosService.rechazarSolicitud(solicitudId);
  }

  solicitudes$: Observable<any[]>;
  cargando = true;

  constructor(
    private contactosService: ContactosService,
    private notificaciones: NotificacionesService
  ) {
    this.solicitudes$ = this.contactosService.solicitudesPendientes$.pipe(
      tap(() => this.cargando = false)
    );
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async aceptarSolicitud(solicitud: any) {
    try {
      await this.contactosService.aceptarSolicitud(solicitud);
      
      if (solicitud.fcmToken) {
        await this.notificaciones.enviarNotificacionContacto(
          solicitud.userId,
          {
            nombre: 'Sistema',
            uid: 'system',
            mensaje: 'Solicitud aceptada'
          }
        );
      }
    } catch (error) {
      console.error('Error aceptando solicitud:', error);
    }
  }
}