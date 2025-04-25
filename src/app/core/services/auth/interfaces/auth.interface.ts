import { Credential } from '@models/credential.model';
import { User } from '@entities/user.entity';

export type Token = {

	UserToken: string,
	DiviceToken?: string

};

export interface IAuth<T extends Credential, U extends User>{

	login(cred: T): Promise<string>;

	logup(cred: T, user: U): Promise<string>;

	logout(): Promise<void>;

}