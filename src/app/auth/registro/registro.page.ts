import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../core/services/autenticacion.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { LoadingController, ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule,
    ReactiveFormsModule
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
      fotoUrl: [''] // Opcional
    });
  }

  async registrar() {
    // Verificar conexión a internet
    const status = await Network.getStatus();
    if (!status.connected) {
      const toast = await this.toastCtrl.create({
        message: 'No hay conexión a internet. Verifica tu conexión.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    if (this.formularioRegistro.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor completa todos los campos correctamente',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando tu cuenta...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const formValue = this.formularioRegistro.value;
      
      // Registrar con email/password
      await this.authService.registrarUsuario(
        formValue.correo, 
        formValue.contrasena,
        {
          nombre: formValue.nombre,
          apellido: formValue.apellido,
          email: formValue.correo,
          telefono: formValue.telefono,
          fotoUrl: formValue.fotoUrl || ''
        }
      );

      // Navegar a home y mostrar mensaje de éxito
      this.router.navigate(['/home']);
      const toast = await this.toastCtrl.create({
        message: '¡Registro exitoso! Bienvenido/a',
        duration: 3000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // El servicio ya maneja los toasts de error, pero podemos agregar uno adicional
      const toast = await this.toastCtrl.create({
        message: error.message || 'Ocurrió un error durante el registro',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();

    } finally {
      await loading.dismiss();
    }
  }
}