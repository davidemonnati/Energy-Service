import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/providers/auth/auth.service.ts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit() {
  }

  async login(): Promise<any> {
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;

    const user: firebase.auth.UserCredential = await this.authService.signInWithEmailAndPassword(email, password);

    if (user) {
      this.router.navigate(['/']);
    }
  }

}
