import { TestBed } from '@angular/core/testing';

import { ConsumptionsService } from './consumptions.service';

describe('ConsumptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsumptionsService = TestBed.get(ConsumptionsService);
    expect(service).toBeTruthy();
  });
});
