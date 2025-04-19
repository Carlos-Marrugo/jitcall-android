import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactosService } from 'src/app/core/services/contacto.service';
import { 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonButton, 
  IonIcon, 
  IonToast,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-agregar-contacto',
  templateUrl: './agregar-contacto.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput, 
    IonItem, 
    IonLabel, 
    IonButton, 
    IonIcon, 
    IonToast,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AgregarContactoComponent {
  formulario = this.fb.nonNullable.group({
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  });
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    private fb: FormBuilder,
    private contactosService: ContactosService
  ) {
    addIcons({ add, close });
  }

  async agregarContacto() {
    if (this.formulario.valid) {
      try {
        const telefono = this.formulario.value.telefono!;
        const exito = await this.contactosService.buscarYAgregarContacto(telefono);
        
        this.toastMessage = exito 
          ? 'Contacto agregado con éxito' 
          : 'No se pudo agregar el contacto';
        this.toastColor = exito ? 'success' : 'warning';
        this.showToast = true;
        
        if (exito) {
          this.formulario.reset();
        }
      } catch (error) {
        this.toastMessage = 'Error al agregar contacto';
        this.toastColor = 'danger';
        this.showToast = true;
      }
    }
  }
}