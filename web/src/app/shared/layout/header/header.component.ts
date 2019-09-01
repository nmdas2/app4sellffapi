import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { CommonService } from 'src/app/_services/common.service';
import { Subscription } from 'rxjs';
import { ProfileInfo } from 'src/app/_models/profileinfo';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  returnUrl: string = "/home";
  loggedInUserInfo: ProfileInfo;
  hasActiveSession: boolean = false;
  searchForm: FormGroup; readonlyUserInfo: ProfileInfo;
  profileSubscription: Subscription;
  submitted = false;
  showheadsection: boolean = false;
  dataDisplayProfile: ProfileInfo;
  toggler: boolean = false;
  @Output() closeSideNav = new EventEmitter<boolean>();
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {

  }

  ngOnInit() {
    
    this.profileSubscription = this.commonService.isProfileSelected$.subscribe(status => {
      this.hasActiveSession = false;
      this.showheadsection = false;
      this.loggedInUserInfo = <ProfileInfo>{};
      
      if (localStorage.getItem('currentUser')) {
        this.dataDisplayProfile = this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.showheadsection = true;
        this.hasActiveSession = true;
      }
      if (!status) {
        if (localStorage.getItem('currentUser')) {
          // this.loggedInUserId = this.loggedInUserInfo.UserId;
          // this.loggedInUserName = this.loggedInUserInfo.DisplayName;
          // this.loggedInUserRank = this.loggedInUserInfo.Rank;
          // this.LoggedInUserProfilePic = this.loggedInUserInfo.ProfilePicPath;
          this.hasActiveSession = true;
        }
      }
      else {
        if (localStorage.getItem('profileviewUser')) {
          this.dataDisplayProfile = this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
          this.showheadsection = true;
        }
      }

    })
    this.searchForm = this.formBuilder.group({
      searchprofiles: ['', [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z \-\']+')]]
    });
  }

  get f() { return this.searchForm.controls; }

  signoutplz() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('profileviewUser');
    this.authenticationService.logout();
    this.hasActiveSession = false;
    this.router.navigate([this.returnUrl]);
  }

  onSubmit() {
    if (this.searchForm.invalid) {
      return;
    }
    var sparam = this.searchForm.value["searchprofiles"];
    this.router.navigate(['/profileinfo/searchsummary/'], { queryParams: {searchTerm : sparam}});
    // this.profileService.getUsersBySearchTerm(this.searchForm.value)
    // .subscribe(
    //     data => {
    //         //this.alertService.success('Registration successful', true);
    //         this.router.navigate(['/login']);
    //     },
    //     error => {
    //         // this.alertService.error(error);
    //         // this.loading = false;
    //     });
  }

  taketoActualProfile() {
    localStorage.removeItem('profileviewUser');
    this.loggedInUserInfo.userRefId = 0;
    this.commonService.isProfileSelected.next(false);
    this.commonService.socialAndHeaderWidgetsTracker.next(true);
    this.router.navigate(['/home']);
  }
  ngOnDestroy() {
    if (this.profileSubscription)
      this.profileSubscription.unsubscribe();
  }

  gotoregister() {
    this.router.navigate(['/register']);
  }

  gotologin() {
    this.router.navigate(['/login']);
  }

  homePageRedirection(){
    this.router.navigate(['/']);
  }

  toggleSideNav(){
    this.toggler = !this.toggler;
    this.closeSideNav.emit(this.toggler);
  }

  navigateTo(url){
    this.router.navigate([url]);
  }

}
