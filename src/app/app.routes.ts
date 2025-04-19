import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./auth/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'agregar-contacto',
    loadComponent: () => import('./contactos/agregar-contacto/agregar-contacto.page').then(m => m.AgregarContactoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'solicitudes',
    loadComponent: () => import('./contactos/components/solicitudes-pendientes/solicitudes-pendientes.component').then(m => m.SolicitudesPendientesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'llamada/:id',
    loadComponent: () => import('./llamada/llamada.page').then(m => m.LlamadaPage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];