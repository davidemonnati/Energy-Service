import { Component } from '@angular/core';
import { AuthService } from './providers/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Energy Frontend';
  opened: boolean;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  getProfileImage() {
    return '../assets/profile.svg.png';
  }

  notLoggedIn() {
    this.router.navigate(['/401']);
  }
}

