import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, doc, serverTimestamp, setDoc, writeBatch } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ToastController, LoadingController } from '@ionic/angular/standalone';
import { firstValueFrom, from } from 'rxjs';
import { NotificacionesService } from './notificaciones.service';

@Injectable({
  providedIn: 'root',
  useFactory: (auth: Auth, firestore: Firestore, router: Router, toastCtrl: ToastController, loadingCtrl: LoadingController, http: HttpClient) => 
    new AutenticacionService(auth, firestore, router, toastCtrl, loadingCtrl, http),
  deps: [Auth, Firestore, Router, ToastController, LoadingController, HttpClient]
})
export class AutenticacionService {
  
  private notificaciones = inject(NotificacionesService); // Añadir esta línea


  constructor(
    private auth = inject(Auth),
    private firestore = inject(Firestore),
    private router = inject(Router),
    private toastCtrl = inject(ToastController),
    private loadingCtrl = inject(LoadingController),
    private http = inject(HttpClient),
  ) {}

  async registrarUsuario(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      
      // Registrar el token después del registro exitoso
      await this.notificaciones.registrarToken();
      
      return userCredential;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Nuevo método mejorado de manejo de errores
  private handleAuthError(error: any): string {
    switch (error.code) {
      case 'auth/admin-restricted-operation':
        return 'Esta operación está restringida. Contacta al administrador.';
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado.';
      case 'auth/invalid-email':
        return 'Correo electrónico no válido.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/operation-not-allowed':
        return 'Este método de autenticación no está habilitado.';
      default:
        console.error('Código de error no manejado:', error.code);
        return 'Ocurrió un error durante el registro.';
    }
  }

  async loginAPIExterna(email: string, password: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string }>(
          'https://ravishing-courtesy-production.up.railway.app/user/login',
          { email, password }
        )
      );
      await Preferences.set({ key: 'apiToken', value: response.token });
    } catch (error) {
      console.error('Error en login API externa:', error);
      throw this.handleAuthError(error);
    }
  }

  async login(email: string, password: string) {
    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();
  
    try {
      // 1. Iniciar sesión
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
  
      // 2. Actualizar lastLogin
      await setDoc(doc(this.firestore, `users/${userCredential.user.uid}`), {
        lastLogin: serverTimestamp()
      }, { merge: true });
  
      // 3. Registrar/actualizar token FCM
      await this.notificaciones.registrarToken();
  
      await loading.dismiss();
      return userCredential;
    } catch (error) {
      await loading.dismiss();
      throw error;
    }
  }

  async estaAutenticado(): Promise<boolean> {
    const user = this.auth.currentUser;
    return !!user;
  }

  async logout() {
    await signOut(this.auth);
    await Preferences.remove({ key: 'userData' });
    this.router.navigate(['/login']);
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}