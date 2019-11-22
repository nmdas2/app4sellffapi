import { TestBed, async, inject } from '@angular/core/testing';

import { OauthGuard } from './oauth.guard';

describe('OauthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OauthGuard]
    });
  });

  it('should ...', inject([OauthGuard], (guard: OauthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
