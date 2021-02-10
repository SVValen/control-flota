import { TestBed } from '@angular/core/testing';

import { GrupoServicioService } from './grupo-servicio.service';

describe('GrupoServicioService', () => {
  let service: GrupoServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupoServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
