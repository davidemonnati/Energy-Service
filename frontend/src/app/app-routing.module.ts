import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphComponent } from './components/graph/graph.component';
import { ApartmentsComponent } from './components/apartments/apartments.component';
import { LoginComponent } from './components/login/login.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthGuardService } from './providers/auth/guard/auth-guard.service';
import { ComparisonComponent } from './components/comparison/comparison.component';
import { GraphscompareComponent } from './components/graphscompare/graphscompare.component';
import { HomeComponent } from './components/home/home.component';
import { NotfoundComponent } from './components/notfound/notfound.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'graph/:row/:number', component: GraphComponent, canActivate: [AuthGuardService], pathMatch: 'full'},
  {path: 'graph', component: GraphComponent, canActivate: [AuthGuardService]},
  {path: 'apartments', component: ApartmentsComponent, canActivate: [AuthGuardService]},
  {path: 'comparison', component: ComparisonComponent, canActivate: [AuthGuardService]},
  {path: 'graphcompare/:valuefirst/:valuesecond', component: GraphscompareComponent, canActivate: [AuthGuardService], pathMatch: 'full'},
  {path: 'graphcompare', component: GraphscompareComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: '401', component: UnauthorizedComponent},
  {path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
