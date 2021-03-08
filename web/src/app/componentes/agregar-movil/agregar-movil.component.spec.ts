import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarMovilComponent } from './agregar-movil.component';

describe('AgregarMovilComponent', () => {
  let component: AgregarMovilComponent;
  let fixture: ComponentFixture<AgregarMovilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarMovilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
