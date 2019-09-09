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
  isEditbale: boolean;
  userProfileInfo: ProfileInfo;
  loggedInUserInfo: ProfileInfo;
  socialIconsDetails: ProfileInfo;
  headerWidgetsDetails: ProfileInfo;
  trackerSub: Subscription;
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
    this.profileSubscription = this.commonService.isProfileSelected$.subscribe(status => {
      setTimeout(() => {
        this.isEditbale = true;
        if (localStorage.getItem('profileviewUser') && status) {
          this.isEditbale = false;
        }
        this.showheadsection = false;
        if (localStorage.getItem('currentUser')) {
          this.dataDisplayProfile = JSON.parse(localStorage.getItem('currentUser'));
          this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
          this.showheadsection = true;
        }

        if (localStorage.getItem('profileviewUser')) {
          this.dataDisplayProfile = JSON.parse(localStorage.getItem('profileviewUser'));
          this.showheadsection = true;
        }
        this.isSummarySub = this.commonService.isSummaryPage$.subscribe(status => {
          setTimeout(() => {
            this.isSummaryPage = status;
          }, 3)

        })
      }, 1)
    });
    this.authenticationService.isLogin$.subscribe(status => {
      this.isLogin = status;
      if (this.isLogin) {
        document.getElementById("mySidenav").style.width = "228px";
        document.getElementById("main").style.marginLeft = "228px";
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

    this.trackerSub = this.commonService.socialAndHeaderWidgetsTracker$.subscribe(status =>{
      let userId = 0;
      if(localStorage.getItem('currentUser')){
        userId = JSON.parse(localStorage.getItem('currentUser')).UserId;
        
      }
      if(localStorage.getItem('profileviewUser')){
        userId = JSON.parse(localStorage.getItem('profileviewUser')).UserId;
        
      }
      if(userId > 0){
        this.authenticationService.socialLinksByUserId(userId)
        .subscribe(res =>{
          this.socialIconsDetails = res;
        }, error =>{

        });
        this.authenticationService.headerWidgetsCountByUserId(userId)
        .subscribe(res =>{
          this.headerWidgetsDetails = res;
        }, error =>{

        })
      }
      
    })
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  closeSideNav(status) {
    this.showSideNav = status;
    if (this.showSideNav) {
      document.getElementById("mySidenav").style.width = "55px";
      document.getElementById("main").style.marginLeft = "55px";
    }
    else {
      document.getElementById("mySidenav").style.width = "228px";
      document.getElementById("main").style.marginLeft = "228px";
    }

  }

  ngAfterViewInit() {


  }
  ngOnDestroy() {
    if (this.isSummarySub)
      this.isSummarySub.unsubscribe();
    if (this.profileSubscription)
      this.profileSubscription.unsubscribe();
    if(this.trackerSub)
      this.trackerSub.unsubscribe();
  }

  postLayoutType: string = "";
  socialLink: string = "";
  showSocialLayout(type: string) {
    this.socialLink = "";
    this.postLayoutType = type;
    switch (type) {
      case "g":
        this.socialLink = this.socialIconsDetails.WebsiteLink;
        break;
      case "tw":
        this.socialLink = this.socialIconsDetails.TwitterLink;
        break;
      case "em":
        this.socialLink = this.socialIconsDetails.SocialEmail;
        break;
      case "fb":
        this.socialLink = this.socialIconsDetails.FacebookLink;
        break;
      case "gp":
        this.socialLink = this.socialIconsDetails.LinkedInLink;
        break;
      case "sem":
        this.socialLink = this.socialIconsDetails.YouTubeLink;
        break;
      case "ig":
        this.socialLink = this.socialIconsDetails.InstagramLink;
        break;
      default:
        break;
    }
  }

  onCancelSocial(){
    this.postLayoutType = '';
  }
  SubmitSocialLink() {
    this.userProfileInfo = <ProfileInfo>{};    
    this.userProfileInfo.UserId = this.loggedInUserInfo.UserId;
    this.userProfileInfo.socialLink = this.socialLink;
    this.userProfileInfo.socialLinkType = this.mapSocialLinkLegends(this.postLayoutType);
    this.commonService.UpdateUserSocialLinkInfo(this.userProfileInfo)
      .subscribe(res => {
        this.authenticationService.socialLinksByUserId(this.loggedInUserInfo.UserId)
        .subscribe(res =>{
          this.socialIconsDetails = res;
        })
      }, error => {
        console.log(error);
      })
    //this.postLayoutType = 1;
  }
  //end social link section

  mapSocialLinkLegends(type: string): number {
    let postLayoutType = 0;
    switch (type) {
      case "g":
        postLayoutType = 1;
        break;
      case "tw":
        postLayoutType = 2;
        break;
      case "em":
        postLayoutType = 3;
        break;
      case "fb":
        postLayoutType = 4;
        break;
      case "gp":
        postLayoutType = 5;
        break;
      case "sem":
        postLayoutType = 6;
        break;
      case "ig":
        postLayoutType = 7;
        break;
      default:
        break;
    }

    return postLayoutType;
  }

}
