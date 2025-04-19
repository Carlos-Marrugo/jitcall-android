import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonFab, IonFabButton, IonLabel,
  IonList, IonItem, IonAvatar
} from '@ionic/angular/standalone';
import { ListaContactosComponent } from '../contactos/components/lista-contactos/lista-contactos.component';
import { ContactosService } from '../core/services/contacto.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonButton, IonIcon,
    IonFab, IonFabButton,
    ListaContactosComponent, IonLabel,
    IonList, IonItem, IonAvatar 
  ]
})
export class HomePage {
  private auth = inject(Auth);
  private router = inject(Router);

  contactos$ = this.contactosService.contactos$;

  constructor(private contactosService: ContactosService) {}

  navegarAAgregar() {
    console.log('Navegando a agregar contacto...');
    this.router.navigate(['/agregar-contacto']);
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

  iniciarLlamada(contacto: any) {
  }
}