import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoServicioComponent } from './grupo-servicio.component';

describe('GrupoServicioComponent', () => {
  let component: GrupoServicioComponent;
  let fixture: ComponentFixture<GrupoServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
