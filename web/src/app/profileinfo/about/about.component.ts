import { Component, OnInit, OnDestroy } from '@angular/core';
import { userAboutInfo, ProfileInfo } from 'src/app/_models/profileinfo';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { UploadType, ProfileSection, UserSocialLinksInfo } from 'src/app/constants';
import { constants as consts } from '../../constants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/_services/common.service';
import { Subscription } from 'rxjs';
import { UserServiceTypes } from 'src/app/_models/userservicetypes';
import { strictEqual } from 'assert';
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
  dataDisplayProfile: ProfileInfo; readonlyUserInfo: ProfileInfo; userCity: string = '';
  profileSubscription: Subscription; svrfilepath: string = ""; UserOccupation: string = '';
  isEditbale: boolean = false; isCityInEditMode: boolean = false; isOccupationInEditMode: boolean = false;
  html: string = `<span class="btn btn-danger">Never trust not sanitized HTML!!!</span>`;
  serviceOffered: UserServiceTypes[];

  constructor(
    private profileInfoService: ProfileinfoService,
    private http: HttpClient,
    private modalService: BsModalService,
    private commonService: CommonService
  ) { }
  ngOnInit() {
    this.profileSubscription = this.commonService.isProfileSelected$.subscribe(status => {
      this.isEditbale = true;
      if (localStorage.getItem('profileviewUser') && status) {
        this.isEditbale = false;
      }
    })
    this.userAboutInfoList = [];
    if (localStorage.getItem('currentUser') != null) {
      this.dataDisplayProfile = this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
    }
    if (localStorage.getItem('profileviewUser') != null) {
      this.dataDisplayProfile = this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
      this.isAboutInEditMode = false;
      this.isCityInEditMode= false;
      this.isOccupationInEditMode = false;
      if (this.loggedInUserInfo)
        this.updateProfileViewsCount();
    }
    if (this.dataDisplayProfile)
      this.getServiceOffered();
    this.textValue = this.dataDisplayProfile.ProfileSummary;
    this.userCity = this.dataDisplayProfile.City;
    this.UserOccupation = this.dataDisplayProfile.Occupation;
    console.log(this.userCity);
    console.log(this.UserOccupation);
    this.getUserAboutText();
    console.log(this.userCity);
    console.log(this.UserOccupation);
  }
  updateProfileViewsCount() {
    this.dataDisplayProfile.UserRefProfileId = this.loggedInUserInfo.UserId;
    this.profileInfoService.UpdateUserViewsCount(this.dataDisplayProfile)
      .subscribe(res => {
        this.dataDisplayProfile.UserRefProfileId = 0;
      }, error => {
        console.log(error);
      })
  }
  logText(): void {
    this.isAboutInEditMode = true;
  }
  enablecityedit(): void{
    this.isCityInEditMode = true;
    console.log(this.userCity);
    console.log(this.UserOccupation);
  }
  enableoccupationedit(): void{
    this.isOccupationInEditMode = true;
    console.log(this.userCity);
    console.log(this.UserOccupation);
  }
  getServiceOffered() {
    this.serviceOffered = [];
    this.profileInfoService.getUserServiceTypesByUserIdServiceId(this.dataDisplayProfile.UserId, 1)
      .subscribe(res => {
        if (res && res.length > 0)
          this.serviceOffered = res;
      }, error => {

      })
  }
  saveupdatedabout(): void {
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
  updatecityvalue(): void {
    this.isCityInEditMode = false;
    if (this.userCity) {
      let userAboutInfoBO = <userAboutInfo>{};
      userAboutInfoBO.City = this.userCity;
      userAboutInfoBO.UserId = this.dataDisplayProfile.UserId;
      this.profileInfoService.updateusercityvalue(userAboutInfoBO)
        .subscribe(res => {
          this.getUserAboutText();
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
      userAboutInfoBO.UserId = this.dataDisplayProfile.UserId;
      this.profileInfoService.updateuseroccupationvalue(userAboutInfoBO)
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
        if (res && res.length) {
          this.userAboutInfoList = res;
          if (this.userAboutInfoList[0].AutoId > 0) {
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
          }
          this.textValue = this.userAboutInfoList[0].About;
          this.userCity = this.userAboutInfoList[0].City;
          this.UserOccupation = this.userAboutInfoList[0].Occupation;
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

    this.fileUploadProgress = '0%';
    this.profileInfoService.saveImageGallery(this.fileData)
      .subscribe(events => {
        this.svrfilepath = events.toString();
        this.fileUploadProgress = "";
        this.previewUrl = "";
        this.saveimagedocdetails(this.svrfilepath);
      }, error => {
        this.fileUploadProgress = "";
        this.previewUrl = "";
      })
    this.AllowImageUpload = false;
  }
  onUploadCancel() {
    this.fileUploadProgress = "";
    this.previewUrl = "";
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

  onCancel() {
    this.isAboutInEditMode = false;
  }
  oncitycancel(){
    this.isCityInEditMode = false;
  }
  onoccupationcancel(){
    this.isOccupationInEditMode = false;
  }
  ngOnDestroy() {
    if (this.profileSubscription)
      this.profileSubscription.unsubscribe();
  }
  removeGalleryicbyid(GalId) {
    this.profileInfoService.removeGalleryPicByAutoid(this.loggedInUserInfo.UserId, GalId)
      .subscribe((res: any) => {
        this.getUserAboutText();
      }, error => {
        console.log(error);
      })
  }
}