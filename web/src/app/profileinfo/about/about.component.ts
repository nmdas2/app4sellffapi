import { Component, OnInit, OnDestroy } from '@angular/core';
import { userAboutInfo, ProfileInfo } from 'src/app/_models/profileinfo';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { User } from 'src/app/_models/user';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { UploadType, ProfileSection, UserSocialLinksInfo } from 'src/app/constants';
import { constants as consts } from '../../constants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ReadOnlyInfo } from 'src/app/_models/readonlyinfo';
import { CommonService } from 'src/app/_services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  userAboutInfoList: userAboutInfo[]; textValue: string = ''; isAboutInEditMode: boolean = false;
  AllowImageUpload: boolean = false; loggedInUserInfo: ProfileInfo; altrPath: string; fileData: File = null;
  previewUrl: any = null; fileUploadProgress: string = null; uploadedFilePath: string = null;
  dynamicImg: string = ""; modalRef: BsModalRef; imgGallery = []; userProfileInfo: ProfileInfo; UserProfileViews: number;
  UserIdForGallery: number; readonlyUserInfo: ReadOnlyInfo;
  profileSubscription: Subscription;
  isEditbale: boolean = false;
  html: string = `<span class="btn btn-danger">Never trust not sanitized HTML!!!</span>`;
  constructor(
    private profileInfoService: ProfileinfoService,
    private http: HttpClient,
    private modalService: BsModalService,
    private commonService: CommonService
  ) {
    
  }
  ngOnInit() {
    this.profileSubscription = this.commonService.isProfileSelected$.subscribe(status => {
      this.isEditbale = true;
      if (localStorage.getItem('profileviewUser') && status) {
        this.isEditbale = false;
      }
    })
    this.userAboutInfoList = [];
    if (localStorage.getItem('currentUser') != null) {
      this.profileInfoService = this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      console.log(this.loggedInUserInfo);
      this.textValue = this.loggedInUserInfo.ProfileSummary;
      this.UserProfileViews = this.loggedInUserInfo.views;
      if (this.loggedInUserInfo.userId == this.loggedInUserInfo.userRefId) {
        this.isAboutInEditMode = true;
      }
      if (this.loggedInUserInfo.userRefId == 0) {
        this.UserIdForGallery = this.loggedInUserInfo.userId;
      } else { this.UserIdForGallery = this.loggedInUserInfo.userRefId; }
    }
    if (localStorage.getItem('profileviewUser') != null) {
      this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
      this.isAboutInEditMode = false;
      this.UserIdForGallery = this.readonlyUserInfo.roUserId;
    }
    // this.profileInfoService.UpdateUserViewsCount(this.loggedInUserInfo)
    //   .subscribe(res => {
    //   }, error => {
    //     console.log(error);
    //   })
    //this.getUserAboutText();
    // if (this.loggedInUserInfo) {
    //   this.profileInfoService.GetUserProfileInfoByUserId(this.loggedInUserInfo.userId)
    //     .subscribe(res => {
    //       this.userProfileInfo = res;
    //       console.log(this.userProfileInfo);
    //     }, error => {
    //       console.log(error);
    //     })
    // }

  }
  logText(): void {
    this.isAboutInEditMode = true;
  }
  saveupdatedabout(): void {
    this.isAboutInEditMode = false;
    if (this.textValue) {
      let userAboutInfoBO = <userAboutInfo>{};
      userAboutInfoBO.About = this.textValue;
      userAboutInfoBO.UserId = this.loggedInUserInfo.userId;
      this.profileInfoService.postUserAboutText(userAboutInfoBO)
        .subscribe(res => {
          this.getUserAboutText();
        }, error => {
          console.log(error);
        })
    }
  }

  getUserAboutText(): void {
    this.userAboutInfoList = [];
    this.profileInfoService.getUsersAboutNGalleryInfo(this.UserIdForGallery)
      .subscribe(res => {
        if (res && res.length)
          this.userAboutInfoList = res;
        this.imgGallery = [];
        for (let img of res) {
          this.altrPath = img.ImagePath;
          if (img.Type == '2') {
            img.ImagePath = "./././assets/selfprflimages/pdf_icon.png";
          }
          let image = {
            "id": img.AutoId,
            "imgUrl": img.ImagePath,
            "galType": img.Type,
            "altUrl": this.altrPath
          };
          this.imgGallery.push(image);
        }
        // if (typeof this.userAboutInfoList[0].About != 'undefined' && this.userAboutInfoList[0].About && this.userAboutInfoList[0].About != null) {
        //   this.textValue = this.userAboutInfoList[0].About;
        // }
        // if (typeof this.userAboutInfoList[0].Views != 'undefined' && this.userAboutInfoList[0].Views) {
        //   this.UserProfileViews = this.userAboutInfoList[0].Views;
        // }
      }, error => {
        console.log(error);
      })
    //Updating views in case of if viewing other profile
    //this.transferDatafromUsertoProfile(this.loggedInUserInfo,this.userProfileInfo);
    
  }

  transferDatafromUsertoProfile(uInfo, pInfo) {
    pInfo.UserId = uInfo.UserId;
    pInfo.UserRefProfileId = uInfo.UserRefProfileId;
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview 
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

  onSubmit() {
    const formData = new FormData();
    formData.append('files', this.fileData);
    this.fileUploadProgress = '0%';
    this.http.post('http://localhost:50517/api/ProfileInfo/SaveImagesForGallery', formData, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {
          this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
        } else if (events.type === HttpEventType.Response) {
          this.fileUploadProgress = '';
          //alert('SUCCESS !!');
        }
      })
    this.saveimagedocdetails(this.fileData.name);
    this.AllowImageUpload = false;
  }

  saveimagedocdetails(flname: string): void {
    let userAboutInfoBO = <userAboutInfo>{};
    userAboutInfoBO.About = this.textValue;
    userAboutInfoBO.UserId = this.loggedInUserInfo.userId;
    userAboutInfoBO.Type = UploadType.Image;
    userAboutInfoBO.Section = ProfileSection.About;
    userAboutInfoBO.ImagePath = consts.ImagesPath + flname
    this.profileInfoService.postUserImagesNDocs(userAboutInfoBO)
      .subscribe(res => {
        this.getUserAboutText();
      }, error => {
        console.log(error);
      })
  }

  checkevent(imgUrl, template, galType, altUrl) {
    this.dynamicImg = imgUrl;
    if (galType == 2) { this.download(altUrl); }
    else { this.modalRef = this.modalService.show(template); }
  }

  download(altUrl: string) {
    //let blob:any = new Blob([response.blob()], { type: 'text/json; charset=utf-8' });
    //const url= window.URL.createObjectURL(blob);
    window.open(altUrl);
    //window.location.href = response.altUrl;
  }

  ShowGalUpPop(): void {
    this.AllowImageUpload = true;
  }

  //social link section
  postLayoutType: string = "";
  socialLink: string = "";
  showSocialLayout(type: string) {

    if (!this.isEditbale) {
      this.showSocialLayoutForOthers(type);
      return;
    }
    this.socialLink = "";
    this.postLayoutType = type;
    switch (type) {
      case "g":
        this.socialLink = this.userProfileInfo.LinkedInLink;
        break;
      case "tw":
        this.socialLink = this.userProfileInfo.TwitterLink;
        break;
      case "em":
        this.socialLink = this.userProfileInfo.email;
        break;
      case "fb":
        this.socialLink = this.userProfileInfo.FacebookLink;
        break;
      case "gp":
        this.socialLink = this.userProfileInfo.TwitterLink;
        break;
      case "sem":
        this.socialLink = this.userProfileInfo.TwitterLink;
        break;
      case "ig":
        this.socialLink = this.userProfileInfo.InstagramLink;
        break;
      default:
        break;
    }
  }

  showSocialLayoutForOthers(type: string) { //readonlyinfo object
    this.socialLink = "";
    this.postLayoutType = type;
    switch (type) {
      case "g":
        this.socialLink = this.userProfileInfo.LinkedInLink;
        break;
      case "tw":
        this.socialLink = this.userProfileInfo.TwitterLink;
        break;
      case "em":
        this.socialLink = this.userProfileInfo.email;
        break;
      case "fb":
        this.socialLink = this.userProfileInfo.FacebookLink;
        break;
      case "gp":
        this.socialLink = this.userProfileInfo.TwitterLink;
        break;
      case "sem":
        this.socialLink = this.userProfileInfo.TwitterLink;
        break;
      case "ig":
        this.socialLink = this.userProfileInfo.InstagramLink;
        break;
      default:
        break;
    }
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
  SubmitSocialLink() {
    //this.userProfileInfo = <ProfileInfo>{};    
    this.userProfileInfo.userId = this.loggedInUserInfo.userId;
    this.userProfileInfo.socialLink = this.socialLink;
    this.userProfileInfo.socialLinkType = this.mapSocialLinkLegends(this.postLayoutType);
    this.profileInfoService.UpdateUserSocialLinkInfo(this.userProfileInfo)
      .subscribe(res => {
      }, error => {
        console.log(error);
      })
    //this.postLayoutType = 1;
  }
  //end social link section

  onCancel(){
    this.isAboutInEditMode = false;
  }

  ngOnDestroy() {
    if (this.profileSubscription)
      this.profileSubscription.unsubscribe();
  }
}