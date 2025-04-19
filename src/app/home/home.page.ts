import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonButton, IonIcon, IonList, IonItem, IonAvatar, IonLabel,
  IonFab, IonFabButton, IonNote
} from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactosService } from '../core/services/contacto.service';
import { LlamadasService } from '../core/services/llamadas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon, IonList,
    IonItem, IonAvatar, IonLabel, IonFab,
    IonFabButton, IonNote
  ]
})
export class HomePage {
  contactos$ = this.contactosService.contactos$;
  private auth = inject(Auth);
  private router = inject(Router);
  private llamadasService = inject(LlamadasService);

  constructor(private contactosService: ContactosService) {}

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

  navegarAAgregar() {
    this.router.navigate(['/agregar-contacto']);
  }

  iniciarLlamada(contacto: any) {
    this.llamadasService.iniciarLlamada(contacto);
  }

  trackByContacto(index: number, contacto: any): string {
    return contacto.id;
  }
}