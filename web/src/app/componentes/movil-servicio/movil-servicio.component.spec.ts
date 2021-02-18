import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovilServicioComponent } from './movil-servicio.component';

describe('MovilServicioComponent', () => {
  let component: MovilServicioComponent;
  let fixture: ComponentFixture<MovilServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovilServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
