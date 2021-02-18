import { TestBed } from '@angular/core/testing';

import { MovilServicioService } from './movil-servicio.service';

describe('MovilServicioService', () => {
  let service: MovilServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovilServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
