import { Injectable, Injector } from '@angular/core';
import { IStatement } from '@interfaces/statement/statement.interface';
import { IContactQuery } from './interfaces/contact.query.interface';
import { Contact } from '@entities/contact.entity';
import { User } from '@entities/user.entity';
import { environment } from '@environment/environment';
import { map, switchMap, catchError } from 'rxjs/operators';
import { forkJoin, Observable, of, from, throwError, combineLatest } from 'rxjs';

import { Firestore, collection, collectionData, addDoc, deleteDoc, updateDoc, docData, doc, getDocs, getDoc, query, where, DocumentReference } from '@angular/fire/firestore';

@Injectable({

	providedIn: 'root'

}) export class ContactService implements IContactQuery<Contact, 'id'>, IStatement<Contact, 'id'>{

	private readonly superCollectionName: string = environment.firebase.collections.user.name;
	private readonly collectionName: string = environment.firebase.collections.contact.name;
	private readonly collectionIDField: string = environment.firebase.collections.contact.idField;
	private superKey!: string;

	public constructor(private firestore: Firestore, private injector: Injector) {}

	public setSuperKey(superKey: string): void{

		this.superKey = superKey;

	}

	public findOne(key: string): Promise<Contact | undefined> {

		return getDoc(doc(

			collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`),
			key

		)).then((snapshot) => snapshot.data()) as Promise<Contact | undefined>;

	}

	public findByName(name: string): Observable<Array<Contact>> {

		return from(getDocs(query(collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`)))).pipe(

			map(snapshot => snapshot.docs.map(

				doc => ({

					id: doc.id,
					...doc.data()

				}) as Contact
				
			).filter(

				Contact => Contact.name.toLowerCase().includes(name.toLowerCase().trim())

			))

		);

	}

	public findAll(): Observable<Array<Contact>> {

		return collectionData(collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`), {

			idField: this.collectionIDField as keyof Contact

		}) as Observable<Array<Contact>>;

	}

	public async insert(entity: Contact): Promise<string> {

		const doc = await addDoc(

			collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`),
			entity

		);

		return doc.id;

	}

	public async update(key: string, entity: Partial<Contact>): Promise<boolean> {

		try{

			await updateDoc(doc(

				this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}/${key}`

			), entity);

			return true;

		}catch (error){

			console.error('Error updating Contact:', error);
			return false;

		}

	}

	public async delete(key: string): Promise<boolean> {

		try{

			await deleteDoc(doc(

				this.firestore,
				`${this.superCollectionName}/${this.superKey}/${this.collectionName}/${key}`

			));

			return true;

		}catch (error){

			console.error('Error deleting Contact:', error);
			return false;

		}

	}

}
