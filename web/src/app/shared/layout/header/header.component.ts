import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { ReadOnlyInfo } from 'src/app/_models/readonlyinfo';
import { CommonService } from 'src/app/_services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  returnUrl: string = "/home";
  loggedInUserInfo: User;
  loggedInUserId: number;
  loggedInUserName: string; loggedInUserRank: number; LoggedInUserProfilePic: string;
  hasActiveSession: boolean = false;
  searchForm: FormGroup; readonlyUserInfo: ReadOnlyInfo;
  profileSubscription: Subscription
  submitted = false;
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private profileService: ProfileinfoService,
    private commonService: CommonService,
  ) {

  }

  ngOnInit() {

    this.profileSubscription = this.commonService.isProfileSelected$.subscribe(status => {
      this.hasActiveSession = false;
      this.loggedInUserInfo = <User>{};
      this.loggedInUserId = 0;
      this.loggedInUserName = "";
      this.loggedInUserRank = 0;
      this.LoggedInUserProfilePic = "";
      
      if(localStorage.getItem('currentUser')){
        this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      }
      if (!status) {
        if (localStorage.getItem('currentUser')) {
          
          this.loggedInUserId = this.loggedInUserInfo.UserId;
          this.loggedInUserName = this.loggedInUserInfo.DisplayName;
          this.loggedInUserRank = this.loggedInUserInfo.Rank;
          this.LoggedInUserProfilePic = this.loggedInUserInfo.ProfilePicPath;
          this.hasActiveSession = true;
        }
      }

      else {
        if (localStorage.getItem('profileviewUser')) {
          this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
          this.loggedInUserId = this.readonlyUserInfo.roUserId;
          this.loggedInUserName = this.readonlyUserInfo.roDisplayName;
          this.loggedInUserRank = this.readonlyUserInfo.roRank;
          this.LoggedInUserProfilePic = this.readonlyUserInfo.roProfilePicPath;
          this.hasActiveSession = true;
        }
      }

    })
    this.searchForm = this.formBuilder.group({
      searchprofiles: ['', [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z \-\']+')]]
    });
  }

  get f() { return this.searchForm.controls; }

  signoutplz() {
    this.authenticationService.logout();
    this.hasActiveSession = false;
    this.router.navigate([this.returnUrl]);
  }

  onSubmit() {
    if (this.searchForm.invalid) {
      return;
    }
    var sparam = this.searchForm.value["searchprofiles"];
    this.router.navigate(['/profileinfo/searchsummary/' + sparam]);
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
    this.loggedInUserInfo.UserRefProfileId = 0;
    this.commonService.isProfileSelected.next(false);
    this.router.navigate(['/home']);
  }
  ngOnDestroy() {
    if (this.profileSubscription)
      this.profileSubscription.unsubscribe();
  }

}
