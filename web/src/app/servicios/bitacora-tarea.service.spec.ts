import { TestBed } from '@angular/core/testing';

import { BitacoraTareaService } from './bitacora-tarea.service';

describe('BitacoraTareaService', () => {
  let service: BitacoraTareaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitacoraTareaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
