import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphComponent } from './components/graph/graph.component';
import { ApartmentsComponent } from './components/apartments/apartments.component';
import { LoginComponent } from './components/login/login.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthGuardService } from './providers/auth/guard/auth-guard.service';


const routes: Routes = [
  {path: 'graph/:row/:number', component: GraphComponent, pathMatch: 'full'},
  {path: 'graph', component: GraphComponent, canActivate: [AuthGuardService], pathMatch: 'full'}, // AAAAAAAAAAAAAAAA
  {path: 'apartments', component: ApartmentsComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: '401', component: UnauthorizedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
