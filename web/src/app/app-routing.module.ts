import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helpers/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {path:'profileinfo',loadChildren: './profileinfo//profileinfo.module#ProfileinfoModule'},
   // { path: 'profileinfo', loadChildren: () => import(`./profileinfo/profileinfo.module`).then(m => m.ProfileinfoModule) },
    // otherwise redirect to home  , canActivate: [AuthGuard]
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
