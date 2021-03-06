import { OauthGuard } from './oauth/oauth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helpers/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConfirmuseraccComponent } from './confirmuseracc/confirmuseracc.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },


  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'confirmuseracc/:hashkey', component: ConfirmuseraccComponent },
  { path: 'profileinfo', loadChildren: './profileinfo//profileinfo.module#ProfileinfoModule' },
  { path: ':dname/profileinfo', loadChildren: './profileinfo//profileinfo.module#ProfileinfoModule' },
  // { path: 'profileinfo', loadChildren: () => import(`./profileinfo/profileinfo.module`).then(m => m.ProfileinfoModule) },
  // otherwise redirect to home  , canActivate: [AuthGuard]
  {
    path: 'editprofile',
    component: EditProfileComponent,
    canActivate: [OauthGuard]
  },
  { path: ':uname', component: HomeComponent },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
