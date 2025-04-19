import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonTabs, IonTabBar, IonTabButton,
  IonIcon, IonLabel
} from '@ionic/angular/standalone';
import { ListaContactosComponent } from '../../components/lista-contactos/lista-contactos.component';
import { AgregarContactoComponent } from '../../components/agregar-contacto/agregar-contacto.component';

@Component({
  selector: 'app-gestion-contactos',
  templateUrl: './gestion-contactos.page.html',
  styleUrls: ['./gestion-contactos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonTabs, IonTabBar, IonTabButton,
    IonIcon, IonLabel,
    ListaContactosComponent, AgregarContactoComponent
  ]
})
export class GestionContactosPage {
  activeTab = 'lista';
}