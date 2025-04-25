export const environment = {

	production: false,
	firebase: {

		credentials: {

			apiKey: "AIzaSyDULmPqfrJUtjR-ecpOyXQL7GM8EwZIq98",
			  authDomain: "jitcall-b8178.firebaseapp.com",
			  projectId: "jitcall-b8178",
			  storageBucket: "jitcall-b8178.firebasestorage.app",
			  messagingSenderId: "389515216707",
			  appId: "1:389515216707:web:492721f50834a38d3051f6",
			  measurementId: "G-4LFYGFEE2P"

		}, collections: {

			user: {

				name: 'users',
				idField: 'id'

			}, contact: {

				name: 'contacts',
				idField: 'id'

			}

		}

	}, cloudinary: {

		credentials: {

			cloud_name: 'dir7hha9x', 
			api_key: '491513494693695', 
			api_secret: 'n2b5YdbqCxrtNlRaOIOM7uZR43s',
			secure: true

		}, endpoints: {

			img: '/resources/image/upload'

		}, baseURL: 'https://api.cloudinary.com/v1_1/'

	}

};