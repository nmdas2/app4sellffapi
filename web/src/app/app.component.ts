import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';



// import './_content/app.less';
import { User } from './_models/user';
import { AuthenticationService } from './_services/authentication.service';
import { CommonService } from './_services/common.service';
import { Subscription } from 'rxjs';
import { ProfileInfo } from './_models/profileinfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: User;
  title = 'sellff-app';
  isLogin: boolean = false;
  showSideNav: boolean = false;
  isSummarySub: Subscription;
  isSummaryPage: boolean;
  profileSubscription: Subscription;
  showheadsection: boolean;
  dataDisplayProfile: ProfileInfo;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {

    if (localStorage.getItem('currentUser')) {
      this.authenticationService.isLogin.next(true);
    }
    else {
      this.authenticationService.isLogin.next(false);
    }

    this.isSummarySub = this.commonService.isSummaryPage$.subscribe(status => {
      setTimeout(() => {
        this.isSummaryPage = status;
      }, 500)

    })
    this.profileSubscription = this.commonService.isProfileSelected$.subscribe(status => {
      setTimeout(() => {
        this.showheadsection = false;
        if (localStorage.getItem('currentUser')) {
          this.dataDisplayProfile = JSON.parse(localStorage.getItem('currentUser'));
          this.showheadsection = true;
        }

        if (localStorage.getItem('profileviewUser')) {
          this.dataDisplayProfile = JSON.parse(localStorage.getItem('profileviewUser'));
          this.showheadsection = true;
        }
      }, 500)
    });
    this.authenticationService.isLogin$.subscribe(status => {
      this.isLogin = status;
      if (this.isLogin) {
        document.getElementById("mySidenav").style.width = "85px";
        document.getElementById("main").style.marginLeft = "85px";
      }
      else {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
      }
    });
    if (localStorage.getItem('profileviewUser')) {
      this.commonService.isProfileSelected.next(true);

    }
    else {
      this.commonService.isProfileSelected.next(false);
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  closeSideNav(status) {
    this.showSideNav = status;
    if (this.showSideNav) {
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
    }
    else {
      document.getElementById("mySidenav").style.width = "85px";
      document.getElementById("main").style.marginLeft = "85px";
    }

  }

  ngAfterViewInit() {
    

  }
  ngOnDestroy() {
    if (this.isSummarySub)
      this.isSummarySub.unsubscribe();
    if (this.profileSubscription)
      this.profileSubscription.unsubscribe();
  }

}
