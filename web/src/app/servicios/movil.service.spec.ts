import { TestBed } from '@angular/core/testing';

import { MovilService } from './movil.service';

describe('MovilService', () => {
  let service: MovilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
