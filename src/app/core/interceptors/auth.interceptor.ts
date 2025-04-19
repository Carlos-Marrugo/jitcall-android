import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Preferences } from '@capacitor/preferences';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(Auth);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleRequest(request, next)).pipe(
      switchMap((promise) => promise)
    );
  }

  private async handleRequest(request: HttpRequest<any>, next: HttpHandler): Promise<Observable<HttpEvent<any>>> {
    // 1. Obtener token de Firebase
    let firebaseToken: string | null = null;
    if (request.url.includes('firestore.googleapis.com')) {
      firebaseToken = await this.auth.currentUser?.getIdToken() || null;
    }

    // 2. Obtener token del servidor externo
    let apiToken: string | null = null;
    if (request.url.includes('ravishing-courtesy-production.up.railway.app')) {
      const { value } = await Preferences.get({ key: 'apiToken' });
      apiToken = value;
    }

    // 3. Clonar request con headers
    let headers = new HttpHeaders();
    if (firebaseToken) {
      headers = headers.set('Authorization', `Bearer ${firebaseToken}`);
    }
    if (apiToken) {
      headers = headers.set('X-API-Token', apiToken);
    }

    const authReq = request.clone({ headers });
    return next.handle(authReq);
  }
}