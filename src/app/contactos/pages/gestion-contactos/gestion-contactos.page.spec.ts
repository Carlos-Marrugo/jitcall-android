import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionContactosPage } from './gestion-contactos.page';

describe('GestionContactosPage', () => {
  let component: GestionContactosPage;
  let fixture: ComponentFixture<GestionContactosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionContactosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
