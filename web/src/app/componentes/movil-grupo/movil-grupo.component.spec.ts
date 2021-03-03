import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovilGrupoComponent } from './movil-grupo.component';

describe('MovilGrupoComponent', () => {
  let component: MovilGrupoComponent;
  let fixture: ComponentFixture<MovilGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovilGrupoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
