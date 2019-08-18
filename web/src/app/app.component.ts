import { Component } from '@angular/core';
import { Router } from '@angular/router';



// import './_content/app.less';
import { User } from './_models/user';
import { AuthenticationService } from './_services/authentication.service';
import { CommonService } from './_services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser: User;
  title = 'sellff-app';
  isLogin: boolean = false;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
}

ngOnInit(){
  this.authenticationService.isLogin$.subscribe(status => {
    this.isLogin = status;
  });
  if (localStorage.getItem('profileviewUser')){
    this.commonService.isProfileSelected.next(true);

  }
  else{
    this.commonService.isProfileSelected.next(false);
  }
}

logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}

}
