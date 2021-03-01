import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacoraTareaComponent } from './bitacora-tarea.component';

describe('BitacoraTareaComponent', () => {
  let component: BitacoraTareaComponent;
  let fixture: ComponentFixture<BitacoraTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitacoraTareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitacoraTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
