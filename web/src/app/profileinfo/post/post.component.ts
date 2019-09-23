import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { User } from 'src/app/_models/user';
import { PostByGroup, Post } from 'src/app/_models/post';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReadOnlyInfo } from 'src/app/_models/readonlyinfo';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { constants as consts } from '../../constants';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { CommonService } from 'src/app/_services/common.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  userPosts: any;  
  PostsByGroups:PostByGroup[]=[];  
  loggedInUserInfo: ProfileInfo; 
  isAboutInEditMode: boolean = false;
  readonlyUserInfo: ProfileInfo; 
  fileData: File = null;  
  dataDisplayProfile: ProfileInfo; 
  constructor(
    private profileInfoService: ProfileinfoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.userPosts = [];
    if(localStorage.getItem('currentUser') != null){
      this.dataDisplayProfile = this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      this.isAboutInEditMode = true;
    }
    if(localStorage.getItem('profileviewUser') != null){
      this.dataDisplayProfile = this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
        this.isAboutInEditMode = false;
    }
    this.createPostTextForm();
    this.createPostGallryForm();
    this.getUserPosts();    
  }

  //get user posts
  getUserPosts(){
    this.userPosts = [];
    this.profileInfoService.getUserPostsByGroups(this.dataDisplayProfile.UserId)
    .subscribe((posts: any) => {
      this.PostsByGroups = posts; 
      console.log(this.PostsByGroups);
    }, error => {
      console.log(error);
    })
  }

  selectedModelImgPath="";
  setModelImage(imgPath:string){
    this.selectedModelImgPath=imgPath;
  }

  //end get user posts
  //create text post
  modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
  };
  popupPostTextModel(template) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, this.config, { class: 'gray modal-small' })
    );
  }

  postTextForm: FormGroup
  createPostTextForm() {
    this.postTextForm = this.fb.group({
      title: ['', [Validators.required]],
      text: ['', [Validators.required]]
    });
  }
  resetPostTextForm(){
    this.modalRef.hide();
    this.postTextForm.reset();
  }
  savePost(postData){
    let post:Post={
      ContentType:1,
      Title:postData.title,
      UserContent:postData.text,
      UserId:this.loggedInUserInfo.UserId
    };
    this.profileInfoService.postText(post)
    .subscribe((res: any) => {
      this.getUserPosts();
      this.commonService.socialAndHeaderWidgetsTracker.next(true);
      this.resetPostTextForm();
    }, error => {
      console.log(error);
    })
  }
  modalRefForGallery: BsModalRef;
  popupPostGalleryModel(template) {
    this.modalRefForGallery = this.modalService.show(template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }
  resetPostGalleryForm(){
    this.modalRefForGallery.hide();
    this.postGalleryForm.reset();
  }
  postGalleryForm: FormGroup
  createPostGallryForm() {
    this.postGalleryForm = this.fb.group({
      image: ['', []],
      webUrl: ['', []]
    });
  }
  attachToFormControl(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileData = <File>event.target.files[0];
      this.postGalleryForm.get('image').setValue(file);
    }
  }
  saveGalleryPost(postData){
    const formData = new FormData();    
    formData.append('file', this.postGalleryForm.get('image').value);
    formData.append('files', this.fileData);
    this.profileInfoService.saveImageGalleryForPost(formData)
      .subscribe(events => {

        let galleryPost:Post={
          image:formData,
          ImagePath:consts.ImagesPath + events.toString(),
          UserId:this.loggedInUserInfo.UserId,
          ContentType:2,
          WebURL:this.postGalleryForm.value.webUrl
        };
        this.profileInfoService.postText(galleryPost)
        .subscribe((res: any) => {
          this.getUserPosts();
          this.resetPostGalleryForm();
        }, error => {
          console.log(error);
        })
    })    
  }
  userContent: string;
  userTitle: string;
  contentModalRef: BsModalRef;  
  getUserContent(content, title, contentTemplate){
    this.userContent = content;
    this.userTitle = title;
    this.contentModalRef = this.modalService.show(contentTemplate,
      Object.assign({}, this.config, { class: 'gray modal-small' })
    );
  }
  getImageUserContent(imgURL, ImagesTemplate)
  {
    this.selectedModelImgPath=imgURL;
    this.contentModalRef = this.modalService.show(ImagesTemplate);
  }
}
