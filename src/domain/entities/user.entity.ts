import { Contact } from './contact.entity';

export interface User{

	id?: string,
	token?: string,
	name: string,
	surname: string,
	contact: string,
	picture: string,
	contacts?: Array<Contact>
	fcmToken?: string;

}