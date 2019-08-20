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
  AllowImageUpload: boolean = false; loggedInUserInfo: User; altrPath: string; fileData: File = null;
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
    this.userAboutInfoList = [];
    if (localStorage.getItem('currentUser') != null) {
      this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      if (this.loggedInUserInfo.UserId == this.loggedInUserInfo.UserRefProfileId) {
        this.isAboutInEditMode = true;
      }
      if (this.loggedInUserInfo.UserRefProfileId == 0) {
        this.UserIdForGallery = this.loggedInUserInfo.UserId;
      } else { this.UserIdForGallery = this.loggedInUserInfo.UserRefProfileId; }
    }
    if (localStorage.getItem('profileviewUser') != null) {
      this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
      this.isAboutInEditMode = false;
      this.UserIdForGallery = this.readonlyUserInfo.roUserId;
    }
    this.getUserAboutText();
  }
  ngOnInit() {
    this.profileSubscription = this.commonService.isProfileSelected$.subscribe(status => {
      this.isEditbale = true;
      if(localStorage.getItem('profileviewUser') && status){
        this.isEditbale = false;
      }
    })
    this.profileInfoService.GetUserProfileInfoByUserId(this.loggedInUserInfo.UserId)
      .subscribe(res => {
        this.userProfileInfo = res;
        console.log(this.userProfileInfo);
      }, error => {
        console.log(error);
      })
  }
  logText(): void {
    this.isAboutInEditMode = true;
  }
  saveupdatedabout(): void {
    this.isAboutInEditMode = false;
    if (this.textValue) {
      let userAboutInfoBO = <userAboutInfo>{};
      userAboutInfoBO.About = this.textValue;
      userAboutInfoBO.UserId = this.loggedInUserInfo.UserId;
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
    this.profileInfoService.getUsersAboutNGalleryInfo(this.UserIdForGallery, ProfileSection.About)
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
        if (typeof this.userAboutInfoList[0].About != 'undefined' && this.userAboutInfoList[0].About && this.userAboutInfoList[0].About != null) {
          this.textValue = this.userAboutInfoList[0].About;
        }
        if (typeof this.userAboutInfoList[0].Views != 'undefined' && this.userAboutInfoList[0].Views) {
          this.UserProfileViews = this.userAboutInfoList[0].Views;
        }
      }, error => {
        console.log(error);
      })
    //Updating views in case of if viewing other profile
    //this.transferDatafromUsertoProfile(this.loggedInUserInfo,this.userProfileInfo);
    this.profileInfoService.UpdateUserViewsCount(this.loggedInUserInfo)
      .subscribe(res => {
      }, error => {
        console.log(error);
      })
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
    userAboutInfoBO.UserId = this.loggedInUserInfo.UserId;
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
  postLayoutType: number = 1;
  socialLink: string = "";
  showSocialLayout(type: number) {
    this.socialLink = "";
    this.postLayoutType = type;
    switch(type){
      case 1:
          this.socialLink = this.userProfileInfo.WebsiteLink;
        break;
      case 2:
          this.socialLink = this.userProfileInfo.TwitterLink;
        break;
      default:
        break;
    }
  }
  SubmitSocialLink() {
    console.log(this.userProfileInfo);
    //this.userProfileInfo = <ProfileInfo>{};    
    this.userProfileInfo.userId = this.loggedInUserInfo.UserId;
    this.userProfileInfo.socialLink = this.socialLink;
    this.userProfileInfo.socialLinkType = this.postLayoutType;
    this.profileInfoService.UpdateUserSocialLinkInfo(this.userProfileInfo)
      .subscribe(res => {
      }, error => {
        console.log(error);
      })
    this.postLayoutType = 1;
  }
  //end social link section

  ngOnDestroy(){
    if(this.profileSubscription)
      this.profileSubscription.unsubscribe();
  }
}