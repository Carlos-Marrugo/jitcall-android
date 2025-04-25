import { Observable} from 'rxjs';
import { IQuery } from '@interfaces/query/query.interface';
import { Contact } from '@entities/contact.entity';

export interface IContactQuery<C extends Contact, K extends keyof C> extends IQuery<C, K>{

	findByName(name: C['name']): Observable<Array<C>>;

}