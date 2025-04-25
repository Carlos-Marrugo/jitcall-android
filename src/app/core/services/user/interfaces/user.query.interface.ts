import { Observable} from 'rxjs';
import { IQuery } from '@interfaces/query/query.interface';
import { User } from '@entities/user.entity';
import { Contact } from '@entities/contact.entity';

export interface IUserQuery<U extends User, K extends keyof U, C extends Contact> extends IQuery<U, K>{

	findOneByContact(contact: C): Observable<U | undefined>;

	findOneWithContacts(key: U[K]): Observable<U | undefined>;

}