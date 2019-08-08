import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  returnUrl: string = "/home";
  loggedInUserInfo: User;
  loggedInUserId: number;
  loggedInUserName: string;
  hasActiveSession: boolean = false;
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
    ) { 
      if(localStorage.getItem('currentUser') != null){
        this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.loggedInUserId = this.loggedInUserInfo.UserId;
        this.loggedInUserName = this.loggedInUserInfo.displayName;
        this.hasActiveSession = true;
      }
      else{
        this.router.navigate([this.returnUrl]);
        this.hasActiveSession = false;
      }
    }

  ngOnInit() {
  }

  signoutplz(){
    this.authenticationService.logout();
    this.router.navigate([this.returnUrl]);
  }

}
