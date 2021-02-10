import { TestBed } from '@angular/core/testing';

import { CheckinshopService } from './checkinshop.service';

describe('CheckinshopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckinshopService = TestBed.get(CheckinshopService);
    expect(service).toBeTruthy();
  });
});
