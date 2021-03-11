import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaExitoComponent } from './alerta-exito.component';

describe('AlertaExitoComponent', () => {
  let component: AlertaExitoComponent;
  let fixture: ComponentFixture<AlertaExitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertaExitoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaExitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
