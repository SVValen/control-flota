import { TestBed } from '@angular/core/testing';

import { AgregarMovilService } from './agregar-movil.service';

describe('AgregarMovilService', () => {
  let service: AgregarMovilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgregarMovilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
