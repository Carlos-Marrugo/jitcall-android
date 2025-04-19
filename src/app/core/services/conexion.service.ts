// src/app/core/services/conexion.service.ts
import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {
  constructor(private toastCtrl: ToastController) {
    this.monitorearConexion();
  }

  async monitorearConexion() {
    Network.addListener('networkStatusChange', status => {
      if (!status.connected) {
        this.mostrarToast('Sin conexión a Internet', 'warning');
      }
    });
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}