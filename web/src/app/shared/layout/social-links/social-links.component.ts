import { Component, OnInit, Input } from '@angular/core';
import { ProfileInfo, userAboutInfo } from 'src/app/_models/profileinfo';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CommonService } from 'src/app/_services/common.service';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss']
})
export class SocialLinksComponent implements OnInit {
  @Input() displayDataProfile: ProfileInfo;
  @Input() isEditbale: Boolean;

  socialIconsDetails: ProfileInfo;
  userProfileInfo: ProfileInfo;
  postLayoutType: string = "";
  PlaceHolder: string = "";
  socialLink: string = "";

  isCityInEditMode: boolean = false;
  isOccupationInEditMode: boolean = false;
  isAboutInEditMode: boolean = false;
  userCity: string = '';
  UserOccupation: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private profileInfoService: ProfileinfoService,
  ) { }

  ngOnInit() {
    this.commonService.socialAndHeaderWidgetsTracker$.subscribe(status => {
      let userId = 0;
      if (localStorage.getItem('currentUser')) {
        userId = JSON.parse(localStorage.getItem('currentUser')).UserId;

      }
      if (localStorage.getItem('profileviewUser')) {
        userId = JSON.parse(localStorage.getItem('profileviewUser')).UserId;

      }
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

  }

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
    this.isCityInEditMode = false;
    if (this.userCity) {
      let userAboutInfoBO = <userAboutInfo>{};
      userAboutInfoBO.City = this.userCity;
      userAboutInfoBO.UserId = this.displayDataProfile.UserId;
      this.profileInfoService.updateusercityvalue(userAboutInfoBO)
        .subscribe(res => {
          if (res) {
            this.commonService.profileData.next(true);
          }
        }, error => {
          console.log(error);
        })
    }
  }

  updateoccupationvalue(): void {
    this.isOccupationInEditMode = false;
    if (this.UserOccupation) {
      let userAboutInfoBO = <userAboutInfo>{};
      userAboutInfoBO.Occupation = this.UserOccupation;
      userAboutInfoBO.UserId = this.displayDataProfile.UserId;
      this.profileInfoService.updateuseroccupationvalue(userAboutInfoBO)
        .subscribe(res => {
          if (res) {
            this.commonService.profileData.next(true);
          }
        }, error => {
          console.log(error);
        })
    }
  }

  oncitycancel() {
    this.isCityInEditMode = false;
  }
  onoccupationcancel() {
    this.isOccupationInEditMode = false;
  }


}
