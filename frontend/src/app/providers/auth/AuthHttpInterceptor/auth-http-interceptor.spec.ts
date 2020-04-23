import { TestBed } from '@angular/core/testing';

import { AuthHttpInterceptor } from './auth-http-interceptor';

describe('AuthHttpInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthHttpInterceptor = TestBed.get(AuthHttpInterceptor);
    expect(service).toBeTruthy();
  });
});
