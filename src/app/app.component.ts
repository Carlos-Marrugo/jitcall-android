import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  PushNotifications,
  PushNotificationSchema,
  ActionPerformed,
  Token
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';

import { 
  logOutOutline, 
  add, 
  arrowBack, 
  personCircle, 
  videocam,
  close,
  notifications
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { NotificacionesService } from './core/services/notificaciones.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {
  private notificaciones = inject(NotificacionesService);
  
  constructor() {
    this.inicializarNotificaciones();
  }

  private inicializarNotificaciones() {
    this.notificaciones.setupPushListeners();
    this.notificaciones.configurarCanalesAndroid();
    this.notificaciones.verificarTokenExistente();
  }
}