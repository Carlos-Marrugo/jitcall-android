import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutenticacionService } from '../services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const autenticado = await this.authService.estaAutenticado();
    if (!autenticado) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}