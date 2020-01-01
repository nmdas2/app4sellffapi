import { Component, OnInit, Input } from '@angular/core';
import { ProfileInfo, userAboutInfo } from 'src/app/_models/profileinfo';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CommonService } from 'src/app/_services/common.service';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss']
})
export class SocialLinksComponent implements OnInit {
  @Input() displayDataProfile: ProfileInfo;
  @Input() isEditbale: Boolean;
  cityForm: FormGroup; OcuupForm: FormGroup; socialIconsDetails: ProfileInfo; userProfileInfo: ProfileInfo;
  postLayoutType: string = ""; PlaceHolder: string = ""; socialLink: string = "";
  loggedInUserInfo: ProfileInfo; dataDisplayProfile: ProfileInfo; readonlyUserInfo: ProfileInfo;
  isCityInEditMode: boolean = false; isOccupationInEditMode: boolean = false;
  isAboutInEditMode: boolean = false; userCity: string = '';  UserOccupation: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private profileInfoService: ProfileinfoService,
  ) { }

  ngOnInit() {
    this.cityForm = this.formBuilder.group({
      CityUser: ['', Validators.required]
  });
  this.OcuupForm = this.formBuilder.group({
      OccupationUser: ['', [Validators.required]]
  });
    this.commonService.socialAndHeaderWidgetsTracker$.subscribe(status => {
      let userId = 0;
      if (localStorage.getItem('currentUser') != null) {
        this.dataDisplayProfile = this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));        
      }
      if (localStorage.getItem('profileviewUser') != null) {
        this.dataDisplayProfile = this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
        this.isAboutInEditMode = false;
      }
      userId = this.dataDisplayProfile.UserId;
      // if (localStorage.getItem('currentUser')) {
      //   userId = JSON.parse(localStorage.getItem('currentUser')).UserId;
        
      // }
      // if (localStorage.getItem('profileviewUser')) {
      //   userId = JSON.parse(localStorage.getItem('profileviewUser')).UserId;

      // }
      this.authenticationService.socialLinksByUserId(userId)
        .subscribe(res => {
          this.socialIconsDetails = res;
        }, error => {

        });
    });

    this.commonService.userChangeSubject.subscribe(val => {
      let userId = JSON.parse(localStorage.getItem('profileviewUser')).UserId;
      this.authenticationService.socialLinksByUserId(userId)
        .subscribe(res => {
          this.socialIconsDetails = res;
        }, error => {

        });
    });

    if (localStorage.getItem('profileviewUser') != null) {
      this.isAboutInEditMode = false;
      this.isCityInEditMode = false;
      this.isOccupationInEditMode = false;
    }
    //this.userCity = this.displayDataProfile.City;
    //this.UserOccupation = this.dataDisplayProfile.Occupation;
    if(this.dataDisplayProfile.Occupation == "") this.dataDisplayProfile.Occupation = "occupation";
  }
  get f() { return this.cityForm.controls; }
  get oc() { return this.OcuupForm.controls; }

  showSocialLayout(type: string) {
    this.socialLink = "";
    this.postLayoutType = type;
    switch (type) {
      case "g":
        this.socialLink = this.socialIconsDetails.WebsiteLink;
        this.PlaceHolder = "Website Link";
        break;
      case "tw":
        this.socialLink = this.socialIconsDetails.TwitterLink;
        this.PlaceHolder = "Twitter Link";
        break;
      case "em":
        this.socialLink = this.socialIconsDetails.SocialEmail;
        this.PlaceHolder = "Social Email";
        break;
      case "fb":
        this.socialLink = this.socialIconsDetails.FacebookLink;
        this.PlaceHolder = "Facebook Link";
        break;
      case "lnk":
        this.socialLink = this.socialIconsDetails.LinkedInLink;
        this.PlaceHolder = "LinkedIn Link";
        break;
      case "sem":
        this.socialLink = this.socialIconsDetails.YouTubeLink;
        this.PlaceHolder = "YouTube Link";
        break;
      case "ins":
        this.socialLink = this.socialIconsDetails.InstagramLink;
        this.PlaceHolder = "Instagram Link";
        break;
      case "pin":
        this.socialLink = this.socialIconsDetails.PinInterestLink;
        this.PlaceHolder = "Pinterest Link";
        break;
      default:
        break;
    }
  }

  onCancelSocial() {
    this.postLayoutType = '';
  }

  SubmitSocialLink() {
    this.userProfileInfo = <ProfileInfo>{};
    this.userProfileInfo.UserId = this.displayDataProfile.UserId;
    this.userProfileInfo.socialLink = this.socialLink;
    this.userProfileInfo.socialLinkType = this.mapSocialLinkLegends(this.postLayoutType);
    this.commonService.UpdateUserSocialLinkInfo(this.userProfileInfo)
      .subscribe(res => {
        this.postLayoutType = '';
        this.authenticationService.socialLinksByUserId(this.displayDataProfile.UserId)
          .subscribe(res => {
            this.socialIconsDetails = res;
          })
      }, error => {
        console.log(error);
      });
  }

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
      case "lnk":
        postLayoutType = 5;
        break;
      case "sem":
        postLayoutType = 6;
        break;
      case "ins":
        postLayoutType = 7;
        break;
      case "pin":
        postLayoutType = 8;
        break;
      default:
        break;
    }

    return postLayoutType;
  }

  enablecityedit(): void {
    this.isCityInEditMode = true;
  }
  enableoccupationedit(): void {
    this.isOccupationInEditMode = true;
  }

  updatecityvalue(): void {
    if (this.cityForm.invalid) { return; }
    this.isCityInEditMode = false;
    if (this.cityForm.value.CityUser != "") {
      let userAboutInfoBO = <userAboutInfo>{};
      userAboutInfoBO.City = this.cityForm.value.CityUser;
      userAboutInfoBO.UserId = this.dataDisplayProfile.UserId;
      this.profileInfoService.updateusercityvalue(userAboutInfoBO)
        .subscribe(res => {
          if (res) {
            this.dataDisplayProfile.City = userAboutInfoBO.City;
            //localStorage.setItem('currentUser', this.dataDisplayProfile);
            this.commonService.profileData.next(true);
          }
        }, error => {
          console.log(error);
        })
      }//else{this.userCity = this.displayDataProfile.City}
  }

  updateoccupationvalue(): void {
    if (this.OcuupForm.invalid) { return; }
    this.isOccupationInEditMode = false;
    if (this.OcuupForm.value.OccupationUser != "") {
      let userAboutInfoBO = <userAboutInfo>{};
      userAboutInfoBO.Occupation = this.OcuupForm.value.OccupationUser;
      userAboutInfoBO.UserId = this.displayDataProfile.UserId;
      this.profileInfoService.updateuseroccupationvalue(userAboutInfoBO)
        .subscribe(res => {
          if (res) {
            this.dataDisplayProfile.Occupation = userAboutInfoBO.Occupation;
            //localStorage.setItem('currentUser', this.dataDisplayProfile);
            this.commonService.profileData.next(true);
          }
        }, error => {
          console.log(error);
        })
    }//else{this.UserOccupation = this.displayDataProfile.Occupation}
  }

  oncitycancel() {
    this.isCityInEditMode = false;
  }
  onoccupationcancel() {
    this.isOccupationInEditMode = false;
  }


}
