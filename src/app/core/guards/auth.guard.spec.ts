// src/app/core/guards/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AutenticacionService', ['estaAutenticado']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AutenticacionService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});