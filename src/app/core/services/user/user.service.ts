import { Injectable } from '@angular/core';
import { ContactService } from '@core/services/contact/contact.service';
import { IStatement } from '@interfaces/statement/statement.interface';
import { IUserQuery } from './interfaces/user.query.interface';
import { User } from '@entities/user.entity';
import { Contact } from '@entities/contact.entity';
import { environment } from '@environment/environment';
import { map, switchMap, catchError } from 'rxjs/operators';
import { forkJoin, Observable, of, from, throwError, combineLatest } from 'rxjs';

import { Firestore, collection, collectionData, addDoc, deleteDoc, updateDoc, docData, doc, setDoc, getDoc, getDocs, query, where, limit } from '@angular/fire/firestore';

@Injectable({

	providedIn: 'root'

}) export class UserService implements IUserQuery<User, 'id', Contact>, IStatement<User, 'id'>{

	private readonly collectionName: string = environment.firebase.collections.user.name;
	private readonly subCollectionName: string = environment.firebase.collections.contact.name;
	private readonly collectionIDField: string = environment.firebase.collections.user.idField;

	public constructor(private firestore: Firestore, private contactService: ContactService) {}

	public findOne(key: string): Promise<User | undefined> {

		return getDoc(doc(

			collection(this.firestore, this.collectionName),
			key

		)).then((snapshot) => snapshot.data()) as Promise<User | undefined>;

	}

	public findOneByContact(contact: Contact): Observable<User | undefined> {

		return collectionData(query(collection(this.firestore, this.collectionName), where('contact', '==', contact.contact), limit(1)), {

			idField: this.collectionIDField as keyof User

		}).pipe(map(

			users => users[0] as User | undefined

		)) as Observable<User>;

	}

	public findOneWithContacts(key: string): Observable<User | undefined> {

		return docData(

			doc(this.firestore, `${this.collectionName}/${key}`),{

				idField: this.collectionIDField as keyof User

			}

		).pipe(

			switchMap(user => {

				if (!user) return of(undefined);

				this.contactService.setSuperKey(key);
				
				return this.contactService.findAll().pipe(

					map(contacts => ({
						...user,
						contacts: contacts
					}))

				);

			}), catchError(error => {

				console.error('Error fetching user with contacts:', error);
				return of(undefined);

			})

		) as Observable<User>;

	}

	public findAll(): Observable<Array<User>> {

		return collectionData(collection(this.firestore, this.collectionName), {

			idField: this.collectionIDField as keyof User

		}) as Observable<Array<User>>;

	}
 
	public async insert(entity: User): Promise<string> {

		await setDoc(doc(this.firestore, `${this.collectionName}/${entity.id as string}`), entity);

		return entity.id as string;

	}

	public async update(key: string, entity: Partial<User>): Promise<boolean> {

		try{

			await updateDoc(doc(this.firestore, `${this.collectionName}/${key}`), entity);

			return true;

		}catch (error){

			console.error('Error updating User:', error);
			return false;

		}

	}

	public async delete(key: string): Promise<boolean> {

		try{

			await deleteDoc(doc(

				this.firestore,
				`${this.collectionName}/${key}`

			));

			return true;

		}catch (error){

			console.error('Error deleting User:', error);
			return false;

		}

	}

}
