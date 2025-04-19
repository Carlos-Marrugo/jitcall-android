import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LlamadaPage } from './llamada.page';

describe('LlamadaPage', () => {
  let component: LlamadaPage;
  let fixture: ComponentFixture<LlamadaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LlamadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
