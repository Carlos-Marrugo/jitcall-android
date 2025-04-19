import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';
import { 
  PushNotifications,
  PushNotificationSchema,
  ActionPerformed,
  Token,
} from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Auth } from '@angular/fire/auth';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private firestore = inject(Firestore);
  private http = inject(HttpClient);
  private platform = inject(Platform);
  private auth = inject(Auth);
  private router = inject(Router);
  
  private apiToken: string | null = null;

  async inicializar() {
    await this.setupPushListeners();
    await this.configurarCanalesAndroid();
  }

  async setupPushListeners() {
    if (!this.platform.is('capacitor')) return;

    try {
      const status = await PushNotifications.requestPermissions();
      if (status.receive !== 'granted') {
        throw new Error('Permisos de notificación denegados');
      }

      await PushNotifications.register();

      PushNotifications.addListener('registration', async (token: Token) => {
        await this.guardarTokenEnFirestore(token.value);
        await Preferences.set({ key: 'fcmToken', value: token.value });
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error en registro FCM:', error);
      });

      PushNotifications.addListener('pushNotificationReceived', 
        async (notification: PushNotificationSchema) => {
          await this.manejarNotificacion(notification);
        }
      );

      PushNotifications.addListener('pushNotificationActionPerformed', 
        async (notification: ActionPerformed) => {
          await this.manejarNotificacionClickeada(notification);
        }
      );
    } catch (error) {
      console.error('Error configurando notificaciones:', error);
    }
  }

  async configurarCanalesAndroid() {
    if (!this.platform.is('android')) return;

    try {
      await LocalNotifications.createChannel({
        id: 'llamadas',
        name: 'Llamadas entrantes',
        importance: 5,
        vibration: true,
        sound: 'default'
      });

      await LocalNotifications.createChannel({
        id: 'solicitudes',
        name: 'Solicitudes de contacto',
        importance: 4,
        vibration: true
      });
    } catch (error) {
      console.error('Error configurando canales Android:', error);
    }
  }

  private async guardarTokenEnFirestore(token: string) {
    const user = this.auth.currentUser;
    if (!user) return;

    try {
      await setDoc(doc(this.firestore, `users/${user.uid}`), {
        fcmToken: token,
        lastTokenUpdate: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error guardando token en Firestore:', error);
    }
  }

  async verificarTokenExistente() {
    if (!this.platform.is('capacitor')) return;

    try {
      const { value: storedToken } = await Preferences.get({ key: 'fcmToken' });
      if (storedToken) {
        await this.guardarTokenEnFirestore(storedToken);
      }
    } catch (error) {
      console.error('Error verificando token existente:', error);
    }
  }

  private async manejarNotificacion(notification: PushNotificationSchema) {
    const data = notification.data;
    if (!data?.type) return;

    switch (data.type) {
      case 'contact_request':
        await this.mostrarAlertaSolicitud(data);
        break;
      case 'incoming_call':
        await this.mostrarAlertaLlamada(data);
        break;
    }
  }

  private async manejarNotificacionClickeada(notification: ActionPerformed) {
    const data = notification.notification.data;
    if (!data?.type) return;

    switch (data.type) {
      case 'contact_request':
        await this.router.navigate(['/solicitudes']);
        break;
      case 'incoming_call':
        await this.router.navigate(['/llamada', data.meetingId], {
          state: {
            meetingId: data.meetingId,
            esIniciador: false,
            nombreContacto: data.name
          }
        });
        break;
    }
  }

  async enviarNotificacionContacto(destinatarioId: string, remitenteInfo: any) {
    try {
      const destinatarioDoc = await getDoc(doc(this.firestore, `users/${destinatarioId}`));
      const destinatarioData = destinatarioDoc.data();
      
      if (!destinatarioData || !destinatarioData['fcmToken']) {
        throw new Error('Usuario no tiene token FCM registrado');
      }

      if (!this.apiToken) {
        const loginRes: any = await lastValueFrom(
          this.http.post(`${environment.notificationApi.baseUrl}/user/login`, {
            email: environment.notificationApi.loginEmail,
            password: environment.notificationApi.loginPassword
          })
        );
        this.apiToken = loginRes.token;
      }

      const payload = {
        token: destinatarioData['fcmToken'],
        notification: {
          title: 'Solicitud de contacto',
          body: `${remitenteInfo.nombre} quiere agregarte`
        },
        android: {
          priority: "high",
          data: {
            userId: destinatarioId,
            meetingId: uuidv4(),
            type: "contact_request",
            name: remitenteInfo.nombre,
            userFrom: remitenteInfo.uid
          }
        }
      };

      await lastValueFrom(
        this.http.post(
          `${environment.notificationApi.baseUrl}/notifications`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${this.apiToken}`
            }
          }
        )
      );
    } catch (error) {
      console.error('Error enviando notificación:', error);
      throw error;
    }
  }

  async enviarNotificacionLlamada(destinatarioId: string, datosLlamada: any) {
    try {
      const destinatarioDoc = await getDoc(doc(this.firestore, `users/${destinatarioId}`));
      const destinatarioData = destinatarioDoc.data();
      
      if (!destinatarioData || !destinatarioData['fcmToken']) {
        throw new Error('Usuario no tiene token FCM registrado');
      }

      if (!this.apiToken) {
        const loginRes: any = await lastValueFrom(
          this.http.post(`${environment.notificationApi.baseUrl}/user/login`, {
            email: environment.notificationApi.loginEmail,
            password: environment.notificationApi.loginPassword
          })
        );
        this.apiToken = loginRes.token;
      }

      const payload = {
        token: destinatarioData['fcmToken'],
        notification: {
          title: 'Llamada entrante',
          body: `${datosLlamada.nombre} te está llamando`
        },
        android: {
          priority: "high",
          data: {
            userId: destinatarioId,
            meetingId: datosLlamada.meetingId,
            type: "incoming_call",
            name: datosLlamada.nombre,
            userFrom: datosLlamada.userId
          }
        }
      };

      await lastValueFrom(
        this.http.post(
          `${environment.notificationApi.baseUrl}/notifications`,
          payload,
          { headers: { Authorization: `Bearer ${this.apiToken}` } }
        )
      );
    } catch (error) {
      console.error('Error enviando notificación de llamada:', error);
      throw error;
    }
  }

  private async mostrarAlertaSolicitud(data: any) {
    // Implementación de alerta
  }

  private async mostrarAlertaLlamada(data: any) {
    // Implementación de alerta
  }

  async actualizarToken(): Promise<void> {
    if (!this.platform.is('capacitor')) return;
  
    try {
      await PushNotifications.removeAllDeliveredNotifications();
      await this.setupPushListeners();
    } catch (error) {
      console.error('Error actualizando token:', error);
    }
  }
}