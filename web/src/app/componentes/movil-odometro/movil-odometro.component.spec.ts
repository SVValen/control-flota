import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovilOdometroComponent } from './movil-odometro.component';

describe('MovilOdometroComponent', () => {
  let component: MovilOdometroComponent;
  let fixture: ComponentFixture<MovilOdometroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovilOdometroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilOdometroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
