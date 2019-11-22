import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { AuthenticationService } from '../_services/authentication.service';
import { HttpEventType } from '@angular/common/http';
import { User } from '../_models/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  profileForm: FormGroup;
  profilepic:string;
  profileDescForm: FormGroup;
  websitesForm: FormGroup;
  skillsForm: FormGroup;
  loggedInUserInfo: User

  fileData: File = null;
  previewUrl: any = null;
  profilePic: string = ""
  submittedPrForm: boolean = false;


  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.createForm();
    this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
    this.profilePic = localStorage.getItem('profilepic');

    if(this.loggedInUserInfo && this.loggedInUserInfo.UserId > 0){
      this.profileForm.get('userName').setValue(this.loggedInUserInfo.DisplayName);
      this.profileForm.get('userName').setValue(this.loggedInUserInfo.DisplayName);
    }
  }

  createForm(){
    this.profileForm = this.fb.group({
      userName: ['', [Validators.required]],
      profileId: ['', [Validators.required]],
      profession: ['', [Validators.required]],
      city: ['', [Validators.required]],
      joinedOn: ['', [Validators.required]],
      servicesOffered: ['', [Validators.required]],
      servicesInterested: ['', [Validators.required]]
    });

    this.profileDescForm = this.fb.group({
      description: ['', [Validators.required]]
    });

    this.websitesForm = this.fb.group({
      personalWebSite: ['', [Validators.required]],
      twitter: ['', [Validators.required]],
      socialMedia: ['', [Validators.required]],
      linkedIn: ['', [Validators.required]],
      instagram: ['', [Validators.required]],
      pinterest: ['', [Validators.required]]
    });

    this.skillsForm = this.fb.group({
      month: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      year: ['', [Validators.required]],
      details: ['', [Validators.required]]
    })
  }

  editProfileDetails(formData){
    this.submittedPrForm = true;
    if(this.profileForm.valid){
      this.submittedPrForm = false;
      console.log(formData);
      this.profileForm.reset();
    }
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
    this.profilePic = ""
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  saveProfilePost() {
    this.commonService.uploadImages(this.loggedInUserInfo.UserId, 1, this.fileData)
      .subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {
        } else if (events.type === HttpEventType.Response) {
          let user = JSON.parse(localStorage.getItem('currentUser'));
          this.previewUrl = null;
          this.authService.loginForImages(user)
            .subscribe(res => {
              if (res.UserId > 0) {
                localStorage.setItem('profilepic', res.ProfilePicPath);
                this.profilePic = res.ProfilePicPath
                this.commonService.profilePicTracker.next(res.ProfilePicPath)
              }
            })
        }
      })
  }

}
