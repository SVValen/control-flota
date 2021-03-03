import { TestBed } from '@angular/core/testing';

import { MovilGrupoService } from './movil-grupo.service';

describe('MovilGrupoService', () => {
  let service: MovilGrupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovilGrupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
