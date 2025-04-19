import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AutenticacionService } from '../../core/services/autenticacion.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule]
})

export class LoginPage {
  formularioLogin = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router
  ) {}

  async login() {
    if (this.formularioLogin.valid) {
      try {
        const { correo, contrasena } = this.formularioLogin.value;
        await this.authService.login(correo!, contrasena!);
        this.formularioLogin.reset();
        this.router.navigate(['/home']); 
      } catch (error) {
        console.error('Error en login:', error);
      }
    }
  }
}