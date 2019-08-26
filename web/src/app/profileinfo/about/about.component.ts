import { Component, OnInit, OnDestroy } from '@angular/core';
import { userAboutInfo, ProfileInfo } from 'src/app/_models/profileinfo';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { UploadType, ProfileSection, UserSocialLinksInfo } from 'src/app/constants';
import { constants as consts } from '../../constants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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
  dynamicImg: string = ""; modalRef: BsModalRef; imgGallery = []; userProfileInfo: ProfileInfo;
  dataDisplayProfile: ProfileInfo; readonlyUserInfo: ProfileInfo;
  profileSubscription: Subscription;
  isEditbale: boolean = false;
  html: string = `<span class="btn btn-danger">Never trust not sanitized HTML!!!</span>`;

  constructor(
    private profileInfoService: ProfileinfoService,
    private http: HttpClient,
    private modalService: BsModalService,
    private commonService: CommonService
  ) {  }
  ngOnInit() {
    this.profileSubscription = this.commonService.isProfileSelected$.subscribe(status => {
      this.isEditbale = true;
      if (localStorage.getItem('profileviewUser') && status) {
        this.isEditbale = false;
      }
    })
    this.userAboutInfoList = [];
    if (localStorage.getItem('currentUser') != null) {
      this.dataDisplayProfile =  this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));  
    }
    if (localStorage.getItem('profileviewUser') != null) {
      this.dataDisplayProfile = this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
      this.isAboutInEditMode = false;
      this.updateProfileViewsCount();
    }
    this.textValue = this.dataDisplayProfile.ProfileSummary;
    this.getUserAboutText();
  }
  updateProfileViewsCount()
  {
    this.profileInfoService.UpdateUserViewsCount(this.dataDisplayProfile)
      .subscribe(res => {
      }, error => {
        console.log(error);
      })
  }
  logText(): void {
    this.isAboutInEditMode = true;
  }
  saveupdatedabout(): void {
    console.log(this.dataDisplayProfile.UserId);
    this.isAboutInEditMode = false;
    if (this.textValue) {
      let userAboutInfoBO = <userAboutInfo>{};
      userAboutInfoBO.About = this.textValue;
      userAboutInfoBO.UserId = this.dataDisplayProfile.UserId;
      this.profileInfoService.postUserAboutText(userAboutInfoBO)
        .subscribe(res => {
          this.getUserAboutText();
        }, error => {
          console.log(error);
        })
    }
  }

  getUserAboutText() {
    this.userAboutInfoList = [];
    this.profileInfoService.getUsersAboutNGalleryInfo(this.dataDisplayProfile.UserId)
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
  

  // showSocialLayoutForOthers(type: string) { //readonlyinfo object
  //   this.socialLink = "";
  //   this.postLayoutType = type;
  //   switch (type) {
  //     case "g":
  //       this.socialLink = this.userProfileInfo.LinkedInLink;
  //       break;
  //     case "tw":
  //       this.socialLink = this.userProfileInfo.TwitterLink;
  //       break;
  //     case "em":
  //       this.socialLink = this.userProfileInfo.email;
  //       break;
  //     case "fb":
  //       this.socialLink = this.userProfileInfo.FacebookLink;
  //       break;
  //     case "gp":
  //       this.socialLink = this.userProfileInfo.TwitterLink;
  //       break;
  //     case "sem":
  //       this.socialLink = this.userProfileInfo.TwitterLink;
  //       break;
  //     case "ig":
  //       this.socialLink = this.userProfileInfo.InstagramLink;
  //       break;
  //     default:
  //       break;
  //   }
  // }

  
  

  onCancel(){
    this.isAboutInEditMode = false;
  }
  
  ngOnDestroy() {
    if (this.profileSubscription)
      this.profileSubscription.unsubscribe();
  }
}