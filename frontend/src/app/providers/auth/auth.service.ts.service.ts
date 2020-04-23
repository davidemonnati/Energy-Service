import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetail: firebase.User = null;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user = firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetail = user;
        } else {
          this.userDetail = null;
        }
      }
    );
  }

  signInWithEmailAndPassword(email: string, password: string){
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  isLoggedIn() {
    if (this.userDetail == null) {
      return false;
    } else {
      return true;
    }
  }

  logout() {
    this.firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['/']));
  }

 returnIdToken(): Promise<string> {
    return firebase.auth().currentUser.getIdToken();
  }
}
