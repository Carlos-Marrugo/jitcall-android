📱 Aplicación de Contactos y Llamadas
Aplicación móvil desarrollada con Ionic y Angular que permite gestionar contactos y realizar llamadas entre usuarios.

🛠 Tecnologías Utilizadas
Frontend:

Ionic 

Angular 

Standalone Components

Backend:

Firebase Authentication

Firestore Database

Complementos:

Capacitor Push Notifications

AngularFire

🌟 Características Principales
🔐 Autenticación Segura
Login con email/contraseña

Registro de nuevos usuarios

Guards de autenticación para rutas protegidas

👥 Gestión de Contactos
Búsqueda y agregado de contactos

Aceptación/rechazo de solicitudes

Visualización de contactos mutuos

Avatar personalizado para cada contacto

📞 Funcionalidad de Llamadas
Inicio de llamadas a contactos

Notificaciones push para llamadas entrantes

🚀 Estructura del Proyecto
Copy
src/
├── app/
│   ├── auth/               # Componentes de autenticación
│   │   ├── login/          # Página de login
│   │   └── registro/       # Página de registro
│   ├── contactos/          # Gestión de contactos
│   ├── home/               # Página principal
│   ├── llamada/            # Funcionalidad de llamadas
│   ├── core/
│   │   ├── guards/         # Guards de ruta
│   │   ├── services/       # Servicios principales
│   │   └── interfaces/     # Interfaces de tipos
│   └── app.routes.ts       # Configuración de rutas
└── main.ts                 # Punto de entrada
🔧 Servicios Clave
AutenticacionService
Maneja login/logout

Verifica estado de autenticación

Integrado con Firebase Auth

NotificacionesService
Configuración de push notifications

Manejo de tokens FCM

Canales de notificación para Android

🛡 Guards Implementados
AuthGuard
Protege rutas que requieren autenticación

Redirige a login si no autenticado

🔄 Flujo de Autenticación
Usuario ingresa credenciales en /login

Servicio valida con Firebase Auth

Redirección a /home si es exitoso

AuthGuard protege rutas privadas

Logout limpia sesión y redirige a login

📦 Dependencias Principales
json
"@angular/fire": "^7.6.0",
"@ionic/angular": "^7.1.1",
"firebase": "^9.23.0",
"@capacitor/push-notifications": "^5.0.0"
🎨 UI Components
Componentes Ionic utilizados:

ion-header, ion-toolbar - Barras de navegación

ion-list, ion-item - Listados de contactos

ion-fab - Botones flotantes

ion-avatar - Avatares de usuario

ion-input - Campos de formulario
