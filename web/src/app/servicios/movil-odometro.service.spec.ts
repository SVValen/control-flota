import { TestBed } from '@angular/core/testing';

import { MovilOdometroService } from './movil-odometro.service';

describe('MovilOdometroService', () => {
  let service: MovilOdometroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovilOdometroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
