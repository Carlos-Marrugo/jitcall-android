// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyDULmPqfrJUtjR-ecpOyXQL7GM8EwZIq98",
  authDomain: "jitcall-b8178.firebaseapp.com",
  projectId: "jitcall-b8178",
  storageBucket: "jitcall-b8178.firebasestorage.app",
  messagingSenderId: "389515216707",
  appId: "1:389515216707:web:492721f50834a38d3051f6",
  measurementId: "G-4LFYGFEE2P"
  },
  notificationApi: {
    baseUrl: "https://ravishing-courtesy-production.up.railway.app",
    loginEmail: "carlos.marrugovargas@unicolombo.edu.co", 
    loginPassword: "carlos123" 
  },
  // Configuración para Jitsi
  jitsi: {
    serverUrl: "https://jitsi1.geeksec.de/",
    defaultRoomPrefix: "jitCall-"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
