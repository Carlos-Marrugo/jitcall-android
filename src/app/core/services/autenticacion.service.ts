import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ToastController, LoadingController } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { NotificacionesService } from './notificaciones.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private http = inject(HttpClient);
  private notificaciones = inject(NotificacionesService);

  async registrarUsuario(email: string, password: string, userData: any) {
    const loading = await this.loadingCtrl.create({ message: 'Registrando...' });
    await loading.present();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        email, 
        password
      );

      await setDoc(doc(this.firestore, `users/${userCredential.user.uid}`), {
        ...userData,
        email: email,
        fechaRegistro: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      await this.notificaciones.inicializar();

      await loading.dismiss();
      return userCredential;
    } catch (error) {
      await loading.dismiss();
      throw this.handleAuthError(error);
    }
  }

  private handleAuthError(error: any): string {
    switch (error.code) {
      case 'auth/admin-restricted-operation':
        return 'Operación restringida';
      case 'auth/email-already-in-use':
        return 'Correo ya registrado';
      case 'auth/invalid-email':
        return 'Correo inválido';
      case 'auth/weak-password':
        return 'Contraseña débil (mínimo 6 caracteres)';
      default:
        return 'Error durante el registro';
    }
  }

  async login(email: string, password: string) {
    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();

    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.router.navigate(['/home']);
      await setDoc(doc(this.firestore, `users/${userCredential.user.uid}`), {
        lastLogin: serverTimestamp()
      },
      { merge: true });

      await this.notificaciones.inicializar();

      await loading.dismiss();
      return userCredential;
    } catch (error) {
      await loading.dismiss();
      throw this.handleAuthError(error);
    }
  }

  async logout() {
    await signOut(this.auth);
    await Preferences.remove({ key: 'userData' });
    this.router.navigate(['/login']);
  }

  async estaAutenticado(): Promise<boolean> {
    return !!this.auth.currentUser;
  }
}