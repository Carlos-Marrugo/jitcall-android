import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AmistadesService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async verificarAmistades() {
    const user = this.auth.currentUser;
    if (!user) return;

    const usersRef = collection(this.firestore, 'users');
    const q = query(
      collection(this.firestore, 'users'),
      where('contacts', 'array-contains', user.uid)
    );

    const querySnapshot = await getDocs(q);

    for (const userDoc of querySnapshot.docs) {
      const userId = userDoc.id;
      
      const misContactosRef = collection(this.firestore, `users/${user.uid}/contacts`);
      const contactoQuery = query(misContactosRef, where('userId', '==', userId));
      const contactoSnapshot = await getDocs(contactoQuery);

      if (!contactoSnapshot.empty) {
        const contactoDoc = contactoSnapshot.docs[0];
        await updateDoc(doc(this.firestore, `users/${user.uid}/contacts/${contactoDoc.id}`), {
          esMutuo: true
        });

        await updateDoc(doc(this.firestore, `users/${userId}/contacts/${user.uid}`), {
          esMutuo: true
        });
      }
    }
  }
}