import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { BookModule } from './books/book.module';
import { LoginComponent } from './home/login.component';
import { UserModule } from './users/user.module';
import { RegisterComponent } from './home/register.component';
import { AlertModule } from './alerts/alert.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'home', component: HomeComponent },
      { path: 'register', component: RegisterComponent},
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' }
    ]),
    SharedModule,
    BookModule,
    UserModule,
    AlertModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
