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
    loginPassword: "carlos123",
    defaultCountryCode: "+57",
    timezone: "America/Bogota"
  },
  jitsiConfig: {
    serverUrl: "https://meet.jit.si",
    defaultRoomOptions: {
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      resolution: 360,
      constraints: {
        video: {
          height: {
            ideal: 360,
            max: 720,
            min: 180
          }
        }
      }
    }
  }
};
