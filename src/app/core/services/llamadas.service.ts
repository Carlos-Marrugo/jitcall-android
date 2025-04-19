import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificacionesService } from './notificaciones.service';

@Injectable({
  providedIn: 'root'
})
export class LlamadasService {
  private notificaciones = inject(NotificacionesService);
  private auth = inject(Auth);
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiToken: string | null = null;

  async iniciarLlamada(contacto: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const meetingId = uuidv4();

    try {
      await this.notificaciones.enviarNotificacionLlamada(
        contacto.id,
        {
          meetingId,
          nombre: user.displayName || 'Usuario',
          userId: user.uid
        }
      );

      await this.router.navigate(['/llamada', meetingId], {
        state: {
          meetingId,
          esIniciador: true,
          nombreContacto: contacto.nombre
        }
      });
    } catch (error) {
      console.error('Error iniciando llamada:', error);
      throw error;
    }
  }
}