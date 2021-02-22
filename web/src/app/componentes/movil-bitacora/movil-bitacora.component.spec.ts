import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovilBitacoraComponent } from './movil-bitacora.component';

describe('MovilBitacoraComponent', () => {
  let component: MovilBitacoraComponent;
  let fixture: ComponentFixture<MovilBitacoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovilBitacoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
