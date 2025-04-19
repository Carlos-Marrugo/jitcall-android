import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreTestService {
  constructor(private firestore: Firestore) {}

  async testConnection() {
    try {
      const docRef = await addDoc(collection(this.firestore, 'test'), {
        test: new Date().toISOString()
      });
      console.log("Conexión exitosa, ID:", docRef.id);
      return true;
    } catch (e) {
      console.error("Error conectando a Firestore:", e);
      return false;
    }
  }
}