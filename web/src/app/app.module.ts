import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { CommonService } from './_services/common.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConfirmuseraccComponent } from './confirmuseracc/confirmuseracc.component';
import { AlertComponent } from './_components/alert/alert.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    ConfirmuseraccComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule
  ],
  providers: [
    CommonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
