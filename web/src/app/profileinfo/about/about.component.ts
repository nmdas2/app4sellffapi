import { Component, OnInit } from '@angular/core';
import { userAboutInfo } from 'src/app/_models/profileinfo';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { User } from 'src/app/_models/user';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { UploadType, ProfileSection } from 'src/app/constants';
import { constants as consts } from '../../constants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  userAboutInfoList: userAboutInfo[];
  textValue: string = 'initial value';
  isAboutInEditMode:boolean = false;
  AllowImageUpload:boolean = false;
  loggedInUserInfo: User;
  altrPath: string;

  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  dynamicImg: string = "";
  modalRef: BsModalRef;
  imgGallery = []
  
  constructor(
    private profileInfoService: ProfileinfoService, 
    private http: HttpClient,
    private modalService: BsModalService
    ) { 
    this.userAboutInfoList = [];
    this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
    this.getUserAboutText();
  }

  ngOnInit() {
  }

  logText(value: string): void {
    this.isAboutInEditMode = true;
  }

  saveupdatedabout(value: string):void {
    this.isAboutInEditMode = false;

    if(this.textValue){
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

  getUserAboutText():void{
    this.userAboutInfoList = [];
    this.profileInfoService.getUsersAboutNGalleryInfo(this.loggedInUserInfo.UserId,ProfileSection.About)
    .subscribe(res =>{
      if(res && res.length)
        this.userAboutInfoList = res;        
        this.imgGallery=[];
        for(let img of res){
          this.altrPath=img.ImagePath;
          if(img.Type == '2')
          {
            img.ImagePath = "./././assets/selfprflimages/pdf_icon.png";
          }
          let image={
            "id":img.AutoId,
            "imgUrl":img.ImagePath,
            "galType":img.Type,
            "altUrl":this.altrPath
          };
          this.imgGallery.push(image);
        }
        this.textValue = this.userAboutInfoList[0].About;
    }, error =>{
      console.log(error);
    })
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
   console.log(this.fileData.name)
  this.fileUploadProgress = '0%';
  this.http.post('http://localhost:50517/api/ProfileInfo/SaveImagesForGallery', formData, {
    reportProgress: true,
    observe: 'events'   
  })
  .subscribe(events => {
    if(events.type === HttpEventType.UploadProgress) {
      this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
      console.log(this.fileUploadProgress);
    } else if(events.type === HttpEventType.Response) {
      this.fileUploadProgress = '';
      console.log(events.body);
      //alert('SUCCESS !!');
    }       
  })  
  this.saveimagedocdetails(this.fileData.name);
  this.AllowImageUpload = false;
}

saveimagedocdetails(flname: string):void {
  let userAboutInfoBO = <userAboutInfo>{};
    userAboutInfoBO.About = this.textValue;
    userAboutInfoBO.UserId = this.loggedInUserInfo.UserId;
    userAboutInfoBO.Type = UploadType.Image;
    userAboutInfoBO.Section = ProfileSection.About;
    userAboutInfoBO.ImagePath = consts.ImagesPath+flname
    this.profileInfoService.postUserImagesNDocs(userAboutInfoBO)
    .subscribe(res => {
      this.getUserAboutText();
    }, error => {
      console.log(error);
    })
}

checkevent(imgUrl, template, galType, altUrl)
{
  this.dynamicImg = imgUrl;
  if(galType == 2){this.download(altUrl);}
  else{this.modalRef = this.modalService.show(template);}
}

download(altUrl: string) {
    //let blob:any = new Blob([response.blob()], { type: 'text/json; charset=utf-8' });
    //const url= window.URL.createObjectURL(blob);
    window.open(altUrl);
    //window.location.href = response.altUrl;
}

ShowGalUpPop(value: string): void {
  this.AllowImageUpload = true;
}

}