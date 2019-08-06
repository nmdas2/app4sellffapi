import { TestBed } from '@angular/core/testing';

import { ProfileinfoService } from './profileinfo.service';

describe('ProfileinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileinfoService = TestBed.get(ProfileinfoService);
    expect(service).toBeTruthy();
  });
});
