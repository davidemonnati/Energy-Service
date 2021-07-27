import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { GraphComponent } from './components/graph/graph.component';
import { ApartmentsComponent } from './components/apartments/apartments.component';
import { LoginComponent } from './components/login/login.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { FooterComponent } from './components/footer/footer.component';
import { ComparisonComponent } from './components/comparison/comparison.component';
import { GraphscompareComponent } from './components/graphscompare/graphscompare.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './providers/auth/auth.service';
import { AuthHttpInterceptorProvider } from './providers/auth/AuthHttpInterceptor/auth-http-interceptor';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AddHomeComponent } from './components/apartments/add-home/add-home.component';
import { DeleteHomeComponent } from './components/apartments/delete-home/delete-home.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    ApartmentsComponent,
    LoginComponent,
    UnauthorizedComponent,
    FooterComponent,
    ComparisonComponent,
    GraphscompareComponent,
    HomeComponent,
    NotfoundComponent,
    AddHomeComponent,
    DeleteHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatGridListModule,
    FlexLayoutModule,
    MatSelectModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [AuthService, AuthHttpInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
