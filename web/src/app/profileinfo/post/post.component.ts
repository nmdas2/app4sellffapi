import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { User } from 'src/app/_models/user';
import { PostByGroup, Post } from 'src/app/_models/post';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReadOnlyInfo } from 'src/app/_models/readonlyinfo';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { constants as consts } from '../../constants';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  userPosts: any;  PostsByGroups:PostByGroup[]=[];  loggedInUserInfo: User; isAboutInEditMode: boolean = false;
  UserIdForGallery: number; MainUserId: number; readonlyUserInfo: ReadOnlyInfo;fileData: File = null;

  constructor(
    private profileInfoService: ProfileinfoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private http: HttpClient,
  ) { 
    this.userPosts = [];
    if(localStorage.getItem('currentUser') != null){
      this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      this.MainUserId = this.loggedInUserInfo.UserId;
      if(this.loggedInUserInfo.UserId == this.loggedInUserInfo.UserRefProfileId){
        this.isAboutInEditMode = true;
      }
      if(this.loggedInUserInfo.UserRefProfileId == 0)
      {
        this.UserIdForGallery = this.loggedInUserInfo.UserId;
        this.isAboutInEditMode = true;
      }else{this.UserIdForGallery = this.loggedInUserInfo.UserRefProfileId;}
    }
    if(localStorage.getItem('profileviewUser') != null){
      this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
        this.isAboutInEditMode = false;
        this.UserIdForGallery = this.readonlyUserInfo.roUserId;
    }
  }

  ngOnInit() {
    this.createPostTextForm();
    this.createPostGallryForm();
    this.getUserPosts();
    
  }

  //get user posts
  getUserPosts(){
    this.userPosts = [];
    this.profileInfoService.getUserPostsByGroups(this.UserIdForGallery)
    .subscribe((posts: any) => {
      this.PostsByGroups = posts;
      //this.PostsByGroups=[];
      // for(let post of posts){
      //   let key=this.getPostGroupKey(post);
      //   let isExist= this.PostsByGroups.filter(pg=>pg.key==key)[0];
      //   if(isExist){
      //     isExist.value.push(post);
      //   }
      //   if(!isExist){
      //     let newPostGroup:PostByGroup={
      //        key:key,
      //        value:[]
      //     };
      //     newPostGroup.value.push(post);
      //     this.PostsByGroups.push(newPostGroup);
      //   }

      // }  
 
    }, error => {
      console.log(error);
    })
  }

  getPostGroupKey(post:Post):string{
    var dateSplit=post.CreatedOn.split('/');

    const d = new Date(+dateSplit[2],+dateSplit[0]-1,+dateSplit[1]);
    let getMonth = Number(dateSplit[0]) - 1
    let month= this.monthNames[getMonth];
    let key= month+" "+ dateSplit[2];
    return key;
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
      this.resetPostTextForm();
    }, error => {
      console.log(error);
    })
  }
  modalRefForGallery: BsModalRef;
  popupPostGalleryModel(template) {
    this.modalRefForGallery = this.modalService.show(template,
      Object.assign({}, this.config, { class: 'gray modal-small' })
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
    let galleryPost:Post={
      image:formData,
      ImagePath:consts.ImagesPath + this.fileData.name,
      UserId:this.loggedInUserInfo.UserId,
      ContentType:2
    };
    this.http.post('http://localhost:50517/api/ProfileInfo/SaveImagesForPost', formData, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {
        } else if (events.type === HttpEventType.Response) {
          
        }
      })
      
    this.profileInfoService.postText(galleryPost)
    .subscribe((res: any) => {
      this.getUserPosts();
      this.resetPostGalleryForm();
    }, error => {
      console.log(error);
    })
  }
  userContent: string;
  contentModalRef: BsModalRef;  
  getUserContent(content, contentTemplate){
    this.userContent = content;
    this.contentModalRef = this.modalService.show(contentTemplate,
      Object.assign({}, this.config, { class: 'gray modal-small' })
    );
  }
}
