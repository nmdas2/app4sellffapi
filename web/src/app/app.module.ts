import { OAuthInterceptor } from './oauth/oauth.interceptor';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { ModalModule } from 'ngx-bootstrap/modal';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { OauthGuard } from './oauth/oauth.guard';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    //AlertComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    ConfirmuseraccComponent,
    EditProfileComponent,
    ChangepasswordComponent,
    ForgotpasswordComponent
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
    RecaptchaFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot()
  ],
  providers: [
    CommonService,
    OauthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OAuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
