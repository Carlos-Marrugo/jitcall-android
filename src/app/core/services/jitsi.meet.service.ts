import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

declare var JitsiMeetExternalAPI: any;

@Injectable({
  providedIn: 'root'
})
export class JitsiMeetService {
  private jitsiApi: any;

  constructor() {
    this.cargarScriptJitsi();
  }

  private cargarScriptJitsi() {
    if (!document.getElementById('jitsi-script')) {
      const script = document.createElement('script');
      script.id = 'jitsi-script';
      script.src = 'https://meet.jit.si/external_api.js';
      script.onload = () => console.log('Jitsi script cargado');
      document.body.appendChild(script);
    }
  }

  iniciarLlamada(roomName: string, userInfo: any) {
    const options = {
      roomName: roomName,
      parentNode: document.querySelector('#jitsi-container'),
      userInfo: {
        displayName: userInfo.displayName,
        email: userInfo.email || ''
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false
      },
      interfaceConfigOverwrite: {
        APP_NAME: 'jitCall',
        SHOW_JITSI_WATERMARK: false
      }
    };

    this.jitsiApi = new JitsiMeetExternalAPI(environment.jitsi.serverUrl, options);
    this.configurarEventos();
  }

  private configurarEventos() {
    this.jitsiApi?.addEventListener('readyToClose', () => {
      this.finalizarLlamada();
    });
  }

  finalizarLlamada() {
    this.jitsiApi?.executeCommand('hangup');
    this.jitsiApi?.dispose();
    this.jitsiApi = null;
  }
}