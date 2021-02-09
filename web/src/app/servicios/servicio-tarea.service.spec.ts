import { TestBed } from '@angular/core/testing';

import { ServicioTareaService } from './servicio-tarea.service';

describe('ServicioTareaService', () => {
  let service: ServicioTareaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioTareaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
