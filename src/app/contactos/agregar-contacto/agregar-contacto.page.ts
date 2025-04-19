import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactosService } from '../../core/services/contacto.service';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, 
  IonButton, IonInput, IonItem, IonLabel, IonToast 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agregar-contacto',
  templateUrl: './agregar-contacto.page.html',
  styleUrls: ['./agregar-contacto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonBackButton, IonButton,
    IonInput, IonItem, IonLabel, IonToast
  ]
})
export class AgregarContactoPage {
  formulario = this.fb.group({
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  });
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private contactosService: ContactosService
  ) {
    addIcons({ arrowBack });
  }

  async agregarContacto() {
    if (this.formulario.valid) {
      const telefono = this.formulario.value.telefono!;
      try {
        const exito = await this.contactosService.buscarYAgregarContacto(telefono);
        
        if (exito) {
          this.toastMessage = 'Contacto agregado exitosamente';
          this.toastColor = 'success';
          this.showToast = true;
          this.formulario.reset();
          setTimeout(() => this.router.navigate(['/home']), 1500);
        }
      } catch (error: any) {
        this.toastMessage = error.message || 'Error al agregar contacto';
        this.toastColor = 'danger';
        this.showToast = true;
      }
    }
  }
}