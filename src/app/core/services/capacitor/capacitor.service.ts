import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CapacitorService {
  private apiUrl = 'https://ravishing-courtesy-production.up.railway.app';
  public notificationReceived$ = new Subject<any>();

  constructor(private http: HttpClient) {}

  public async initPushNotifications(userId: string, userService: any): Promise<string | undefined> {
    const status = await PushNotifications.requestPermissions();
    if (status.receive !== 'granted') {
      throw new Error('Permisos denegados');
    }

    await PushNotifications.register();
    this.setupListeners();

    return new Promise((resolve) => {
      PushNotifications.addListener('registration', 
        async (token: Token) => {
          console.log('Token FCM:', token.value);
          await userService.update(userId, { token: token.value });
          resolve(token.value);
        }
      );
    });
  }

  private setupListeners(): void {
    PushNotifications.addListener('pushNotificationReceived',
      (notification) => {
        this.notificationReceived$.next(notification);
      }
    );
  }

  public async sendNotification(token: string, message: string): Promise<void> {
    const payload = {
      token: token,
      notification: {
        title: 'Nueva notificación',
        body: message
      }
    };

    try {
      const authResponse: any = await this.http.post(`${this.apiUrl}/user/login`, {
        email: 'carlos.marrugovargas@unicolombo.edu.co',
        password: 'carlos123'
      }).toPromise();

      await this.http.post(`${this.apiUrl}/notifications`, payload, {
        headers: {
          'Authorization': `Bearer ${authResponse.token}`
        }
      }).toPromise();
    } catch (e) {
      console.error('Error sending notification:', e);
      throw e;
    }
  }
}