import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this for async pipe
import { IonicModule } from '@ionic/angular'; // Add this for Ionic components
import { AmistadesService } from 'src/app/core/services/amistades.service';
import { ContactosService } from 'src/app/core/services/contacto.service';
import { LlamadasService } from 'src/app/core/services/llamadas.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.scss'],
  standalone: true, // Add this if using standalone components
  imports: [CommonModule, IonicModule, RouterModule] // Add these imports
})
export class ListaContactosComponent implements OnInit {
  contactos$ = this.contactosService.contactos$;

  constructor(
    private contactosService: ContactosService,
    private llamadasService: LlamadasService,
    private amistadesService: AmistadesService
  ) {}

  ngOnInit() {
    this.amistadesService.verificarAmistades();
  }

  iniciarLlamada(contacto: any) {
    this.llamadasService.iniciarLlamada(contacto);
  }
}