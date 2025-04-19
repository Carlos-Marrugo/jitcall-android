import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../core/services/autenticacion.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, 
  IonLabel, IonInput, IonButton, IonIcon, IonText, IonButtons,    
  IonBackButton,
} from '@ionic/angular/standalone';
import { Network } from '@capacitor/network';
import { LoadingController, ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton, IonIcon, IonText, IonButtons,   
    IonBackButton,
  ]
})
export class RegistroPage {
  formularioRegistro: FormGroup;
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router
  ) {
    this.formularioRegistro = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      fotoUrl: ['']
    });
  }

  async registrar() {
    const status = await Network.getStatus();
    if (!status.connected) {
      await this.mostrarToast('No hay conexión a internet', 'danger');
      return;
    }

    if (this.formularioRegistro.invalid) {
      await this.mostrarToast('Complete todos los campos', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const formValue = this.formularioRegistro.value;
      
      await this.authService.registrarUsuario(
        formValue.correo, 
        formValue.contrasena,
        {
          nombre: formValue.nombre,
          apellido: formValue.apellido,
          telefono: formValue.telefono,
          fotoUrl: formValue.fotoUrl || ''
        }
      );

      await this.mostrarToast('¡Registro exitoso!', 'success');
      this.router.navigate(['/home']);
    } catch (error: any) {
      await this.mostrarToast(error || 'Error en registro', 'danger');
    } finally {
      await loading.dismiss();
    }
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