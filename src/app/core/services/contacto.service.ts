import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  query, 
  where, 
  DocumentData,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  runTransaction,
  limit,
  writeBatch
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, from, switchMap, BehaviorSubject } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';
import { getFunctions, httpsCallable } from '@angular/fire/functions';
import { NotificacionesService } from './notificaciones.service'; 


@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  private notificacionesService = inject(NotificacionesService);

  private firestore = inject(Firestore);
  
  private auth = inject(Auth);
  private toastCtrl = inject(ToastController);
  private functions = getFunctions();
  
  private contactosSubject = new BehaviorSubject<any[]>([]);
  public contactos$ = this.contactosSubject.asObservable();

  private solicitudesSubject = new BehaviorSubject<any[]>([]);
  public solicitudesPendientes$ = this.solicitudesSubject.asObservable();

  constructor() {
    this.iniciarEscuchaContactos();
    this.iniciarEscuchaSolicitudes();
  }

  private iniciarEscuchaContactos() {
    authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          this.contactosSubject.next([]);
          return from([]);
        }
        
        const contactosRef = collection(this.firestore, `users/${user.uid}/contacts`);
        const q = query(contactosRef);
        
        return new Observable(subscriber => {
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const contactos = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return { 
                id: doc.id, 
                ...this.convertToObject(data),
                fcmToken: data['fcmToken'] || null
              };
            });
            this.contactosSubject.next(contactos);
            subscriber.next(contactos);
          });
          
          return () => unsubscribe();
        });
      })
    ).subscribe();
  }

  private iniciarEscuchaSolicitudes() {
    authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          this.solicitudesSubject.next([]);
          return from([]);
        }
        
        const solicitudesRef = collection(this.firestore, `users/${user.uid}/solicitudes`);
        const q = query(solicitudesRef);
        
        return new Observable(subscriber => {
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const solicitudes = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            this.solicitudesSubject.next(solicitudes);
            subscriber.next(solicitudes);
          });
          
          return () => unsubscribe();
        });
      })
    ).subscribe();
  }

  async obtenerSolicitudesPendientes(): Promise<any[]> {
    const user = this.auth.currentUser;
    if (!user) return [];
    
    const solicitudesRef = collection(this.firestore, `users/${user.uid}/solicitudes`);
    const querySnapshot = await getDocs(solicitudesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async aceptarSolicitud(solicitud: any) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const solicitudRef = doc(this.firestore, `users/${user.uid}/solicitudes/${solicitud.id}`);
    await deleteDoc(solicitudRef);

    await Promise.all([
      updateDoc(doc(this.firestore, `users/${user.uid}/contacts/${solicitud.userId}`), {
        esMutuo: true
      }),
      updateDoc(doc(this.firestore, `users/${solicitud.userId}/contacts/${user.uid}`), {
        esMutuo: true
      })
    ]);

    const enviarNotificacion = httpsCallable(this.functions, 'enviarNotificacion');
    await enviarNotificacion({
      token: solicitud.fcmToken,
      titulo: 'Solicitud aceptada',
      cuerpo: `${user.displayName || 'Alguien'} ha aceptado tu solicitud de contacto`,
      data: { tipo: 'solicitud-aceptada' }
    });

    await this.mostrarToast('Solicitud aceptada', 'success');
  }

  async rechazarSolicitud(solicitudId: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const solicitudRef = doc(this.firestore, `users/${user.uid}/solicitudes/${solicitudId}`);
    await deleteDoc(solicitudRef);

    await this.mostrarToast('Solicitud rechazada', 'success');
  }

  async buscarYAgregarContacto(telefono: string): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('telefono', '==', telefono));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('No se encontró usuario con ese teléfono');
    }

    const contactoDoc = querySnapshot.docs[0];
    const contactoId = contactoDoc.id;
    const contactoData = contactoDoc.data();

    const contactoExistente = await getDoc(doc(this.firestore, `users/${user.uid}/contacts/${contactoId}`));
    if (contactoExistente.exists()) {
      throw new Error('Este contacto ya existe');
    }

    await setDoc(doc(this.firestore, `users/${contactoId}/solicitudes/${user.uid}`), {
      userId: user.uid,
      nombre: user.displayName || 'Usuario',
      telefono: user.phoneNumber || '',
      estado: 'pendiente',
      fechaSolicitud: serverTimestamp(),
      fcmToken: contactoData['fcmToken'] || null
    });

    await this.notificacionesService.enviarNotificacionContacto(
      contactoId,
      {
        uid: user.uid,
        nombre: user.displayName || 'Usuario',
        telefono: user.phoneNumber || ''
      }
    );

    return true;
  }


  private async crearSolicitud(userId: string, solicitudData: any): Promise<void> {
    const solicitudesRef = collection(this.firestore, `users/${userId}/solicitudes`);
    const nuevaSolicitudRef = doc(solicitudesRef, solicitudData.userId);
    await setDoc(nuevaSolicitudRef, solicitudData);
  }

  private async verificarContactoExistente(userId: string, contactoId: string): Promise<boolean> {
    const contactosRef = collection(this.firestore, `users/${userId}/contacts`);
    const q = query(contactosRef, where('userId', '==', contactoId));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  async agregarContacto(telefono: string): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('telefono', '==', telefono));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('No se encontró usuario con ese teléfono');
    }

    const contactoDoc = querySnapshot.docs[0];
    const contactoId = contactoDoc.id;
    const contactoData = contactoDoc.data();

    const batch = writeBatch(this.firestore);
    
    const solicitudRef = doc(collection(this.firestore, `users/${contactoId}/requests`));
    batch.set(solicitudRef, {
      userId: user.uid,
      nombre: user.displayName || 'Usuario',
      telefono: user.phoneNumber || '',
      estado: 'pendiente',
      fecha: serverTimestamp()
    });

    await batch.commit();

    await this.notificacionesService.enviarNotificacionContacto(
      contactoId,
      {
        uid: user.uid,
        nombre: user.displayName || 'Usuario',
        telefono: user.phoneNumber || ''
      }
    );

    return true;
  }

  private convertToObject(data: DocumentData): any {
    return JSON.parse(JSON.stringify(data));
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

  private async enviarNotificacionSolicitud(contactoId: string, mensaje: string) {
    try {
      const userDoc = await getDoc(doc(this.firestore, `users/${contactoId}`));
      const fcmToken = userDoc.data()?.['fcmToken'];
      
      if (!fcmToken) return;

      const enviarNotificacion = httpsCallable(this.functions, 'enviarNotificacion'); 
      await enviarNotificacion({
        token: fcmToken,
        titulo: 'Nueva solicitud de contacto',
        cuerpo: mensaje,
        data: { tipo: 'solicitud-contacto' }
      });
    } catch (error) {
      console.error('Error enviando notificación:', error);
    }
  }

  private async verificarPermisos() {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    return user;
  }
  
  async obtenerContactos(): Promise<any[]> {
    const user = await this.verificarPermisos();
    
    try {
      const contactosRef = collection(this.firestore, `users/${user.uid}/contacts`);
      const querySnapshot = await getDocs(contactosRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error obteniendo contactos:', error);
      throw error;
    }
  }
}