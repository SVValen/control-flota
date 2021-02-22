import { TestBed } from '@angular/core/testing';

import { MovilBitacoraService } from './movil-bitacora.service';

describe('MovilBitacoraService', () => {
  let service: MovilBitacoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovilBitacoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
