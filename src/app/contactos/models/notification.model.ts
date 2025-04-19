export interface Contacto {
    id?: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email?: string;
    userId: string;
    fcmToken?: string;
  }
  
  export interface NotificationPayload {
    token: string;
    notification: {
      title: string;
      body: string;
    };
    data: {
      type: string;
      meetingId: string;
      userId: string;
    };
  }
  
  export interface NotificationData {
    token: string;
    meetingId: string;
    nombre: string;
    userId: string;
  }