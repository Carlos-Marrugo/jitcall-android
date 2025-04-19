import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarContactoPage } from './agregar-contacto.page';

describe('AgregarContactoPage', () => {
  let component: AgregarContactoPage;
  let fixture: ComponentFixture<AgregarContactoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarContactoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
