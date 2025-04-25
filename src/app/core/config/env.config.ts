import { environment } from '@environment/environment';

export const firebaseConfig = {

	apiKey: environment.firebase.credentials.apiKey,
	authDomain: environment.firebase.credentials.authDomain,
	projectId: environment.firebase.credentials.projectId,
	storageBucket: environment.firebase.credentials.storageBucket,
	messagingSenderId: environment.firebase.credentials.messagingSenderId,
	appId: environment.firebase.credentials.appId

};

export const cloudinaryConfig = {

	cloudName: environment.cloudinary.credentials.cloud_name, 
	apiKey: environment.cloudinary.credentials.api_key, 
	apiSecret: environment.cloudinary.credentials.api_secret,
	secure: environment.cloudinary.credentials.secure

};