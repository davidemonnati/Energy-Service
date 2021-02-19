import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { take, map, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {


  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate() {
    return this.authService.getAuthState().authState.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if(!loggedIn){
          this.router.navigate(['/401'])
        }
      })
    );
  }
}
