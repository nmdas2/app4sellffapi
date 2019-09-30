import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { User } from './_models/user';
import { AuthenticationService } from './_services/authentication.service';
import { CommonService } from './_services/common.service';
import { Subscription } from 'rxjs';
import { ProfileInfo } from './_models/profileinfo';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: User; bannerpicpath: string = '';
  title = 'sellff-app'; previewUrl: any = null;
  isLogin: boolean = false; fileData: File = null;
  showSideNav: boolean = false; fileUploadProgress: string = null; uploadedFilePath: string = null;
  isSummarySub: Subscription; postGalleryForm: FormGroup; postProfileForm: FormGroup;
  isSummaryPage: boolean; AllowImageUpload: boolean = false;
  profileSubscription: Subscription;
  showheadsection: boolean;
  dataDisplayProfile: ProfileInfo;
  isEditbale: boolean; modalRef: BsModalRef;
  userProfileInfo: ProfileInfo;
  loggedInUserInfo: ProfileInfo;
  socialIconsDetails: ProfileInfo;
  headerWidgetsDetails: ProfileInfo;
  trackerSub: Subscription;
  profilePic: string;

  profilePicSub : Subscription;
  constructor(
    private router: Router,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService,
    private commonService: CommonService,
    private fb: FormBuilder
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
    this.profilePicSub = this.commonService.profilePicTracker$.subscribe(imgPath => {
      this.profilePic = imgPath;
    })
    this.profileSubscription = this.commonService.isProfileSelected$.subscribe(status => {
      setTimeout(() => {
        this.isEditbale = true;
        if (localStorage.getItem('profileviewUser') && status) {
          this.isEditbale = false;
          this.bannerpicpath = JSON.parse(localStorage.getItem('profileviewUser')).BannerPicPath
        }
        this.showheadsection = false;
        if (localStorage.getItem('currentUser')) {
          this.dataDisplayProfile = JSON.parse(localStorage.getItem('currentUser'));
          this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
          this.showheadsection = true;
        }

        if (localStorage.getItem('profilepic') && this.isEditbale) {
          this.commonService.profilePicTracker.next(localStorage.getItem('profilepic'));
        }
        if (localStorage.getItem('bannerpic') && this.isEditbale) {
          this.bannerpicpath = localStorage.getItem('bannerpic')
        }

        if (localStorage.getItem('profileviewUser')) {
          this.dataDisplayProfile = JSON.parse(localStorage.getItem('profileviewUser'));
          this.showheadsection = true;
          this.commonService.profilePicTracker.next(this.dataDisplayProfile.ProfilePicPath);
          //localStorage.setItem('profilepic', this.profilePic)
        }
        //if (this.dataDisplayProfile && this.dataDisplayProfile.BannerPicPath)
          //this.bannerpicpath = this.dataDisplayProfile.BannerPicPath;
          this.isSummarySub = this.commonService.isSummaryPage$.subscribe(status => {
            setTimeout(() => {
              this.isSummaryPage = status;
            }, 3)

          })
      }, 1)
    });
    this.postGalleryForm = this.fb.group({
      image: ['', []]
    });
    this.postProfileForm = this.fb.group({
      image: ['', []]
    });
    this.authenticationService.isLogin$.subscribe(status => {
      this.isLogin = status;
      if (this.isLogin) {
        // document.getElementById("mySidenav").style.width = "228px";
        // document.getElementById("main").style.marginLeft = "228px";
      }
      else {
        // document.getElementById("mySidenav").style.width = "0";
        // document.getElementById("main").style.marginLeft = "0";
      }
    });
    if (localStorage.getItem('profileviewUser')) {
      this.commonService.isProfileSelected.next(true);

    }
    else {
      this.commonService.isProfileSelected.next(false);
    }

    this.trackerSub = this.commonService.socialAndHeaderWidgetsTracker$.subscribe(status => {
      let userId = 0;
      if (localStorage.getItem('currentUser')) {
        userId = JSON.parse(localStorage.getItem('currentUser')).UserId;

      }
      if (localStorage.getItem('profileviewUser')) {
        userId = JSON.parse(localStorage.getItem('profileviewUser')).UserId;

      }
      if (userId > 0) {
        this.authenticationService.socialLinksByUserId(userId)
          .subscribe(res => {
            this.socialIconsDetails = res;
          }, error => {

          });
        this.authenticationService.headerWidgetsCountByUserId(userId)
          .subscribe(res => {
            this.headerWidgetsDetails = res;
          }, error => {

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
      // document.getElementById("mySidenav").style.width = "55px";
      // document.getElementById("main").style.marginLeft = "55px";
    }
    else {
      // document.getElementById("mySidenav").style.width = "228px";
      // document.getElementById("main").style.marginLeft = "228px";
    }

  }

  activeUrl: string;
  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.activeUrl = event.url
      }
    })

  }
  ngOnDestroy() {
    if (this.isSummarySub)
      this.isSummarySub.unsubscribe();
    if (this.profileSubscription)
      this.profileSubscription.unsubscribe();
    if (this.trackerSub)
      this.trackerSub.unsubscribe();
    if(this.profilePicSub)
      this.profilePicSub.unsubscribe();
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

  onCancelSocial() {
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
          .subscribe(res => {
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

  uploadbannerpic(Bannerpictemplate) {
    this.modalRef = this.modalService.show(Bannerpictemplate);
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }
  //AllowImageUpload = false
  saveGalleryPost(postData) {
    // const formData = new FormData();
    // formData.append('files', this.fileData);
    this.fileUploadProgress = '0%';
    this.commonService.uploadImages(this.loggedInUserInfo.UserId, 2, this.fileData)
      .subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {
          this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
        } else if (events.type === HttpEventType.Response) {
          this.modalRef.hide();
          let user = JSON.parse(localStorage.getItem('currentUser'));
          this.authenticationService.loginForImages(user)
            .subscribe(res => {
              if (res.UserId > 0) {
                
                localStorage.setItem('bannerpic', res.BannerPicPath);
                
                this.bannerpicpath = res.BannerPicPath;
              }
            })
          this.fileUploadProgress = '';
        }
      })
  }
  onCancel() {
    this.modalRef.hide();
    this.AllowImageUpload = false;
  }
  uploadprofilepic(Profilepictemplate) {
    this.modalRef = this.modalService.show(Profilepictemplate);
  }
  saveProfilePost(postData) {
    this.fileUploadProgress = '0%';
    this.commonService.uploadImages(this.loggedInUserInfo.UserId, 1, this.fileData)
      .subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {
          this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
        } else if (events.type === HttpEventType.Response) {
          this.modalRef.hide();
          let user = JSON.parse(localStorage.getItem('currentUser'));
          this.authenticationService.loginForImages(user)
            .subscribe(res => {
              if (res.UserId > 0) {
                localStorage.setItem('profilepic', res.ProfilePicPath);
                
                this.commonService.profilePicTracker.next(res.ProfilePicPath)
                
              }
            })
          this.fileUploadProgress = '';
        }
      })
  }

}
