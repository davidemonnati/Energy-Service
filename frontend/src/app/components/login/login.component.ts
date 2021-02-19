import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = false;
  visible = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  checkIfEmpty(email: string, password: string): boolean {
    return (!email || !password)? true: false;
  }

  async login(): Promise<any> {
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;
    this.error = this.checkIfEmpty(email, password);

    const user = await this.authService.signInWithEmailAndPassword(email, password)
    .then((login) => {
      return login;
    }).catch((err) => {
      this.error = true;
      console.log('Username o password errati');
    })

    if (user) {
      this.router.navigate(['/']);
    }
  }
}
