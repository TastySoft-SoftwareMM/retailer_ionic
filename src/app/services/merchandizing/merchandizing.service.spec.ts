import { TestBed } from '@angular/core/testing';

import { MerchandizingService } from './merchandizing.service';

describe('MerchandizingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MerchandizingService = TestBed.get(MerchandizingService);
    expect(service).toBeTruthy();
  });
});
