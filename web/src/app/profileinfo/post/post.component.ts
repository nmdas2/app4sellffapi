import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { User } from 'src/app/_models/user';
import { PostByGroup, Post } from 'src/app/_models/post';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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
  UserIdForGallery: number; MainUserId: number;

  constructor(
    private profileInfoService: ProfileinfoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
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
      this.loggedInUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
        this.isAboutInEditMode = false;
        this.UserIdForGallery = this.loggedInUserInfo.UserRefProfileId;
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
    this.profileInfoService.getUserPosts(this.UserIdForGallery)
    .subscribe((posts: Post[]) => {
      this.PostsByGroups=[];
      for(let post of posts){
        let key=this.getPostGroupKey(post);
        let isExist= this.PostsByGroups.filter(pg=>pg.key==key)[0];
        if(isExist){
          isExist.value.push(post);
        }
        if(!isExist){
          let newPostGroup:PostByGroup={
             key:key,
             value:[]
          };
          newPostGroup.value.push(post);
          this.PostsByGroups.push(newPostGroup);
        }

      }       
    }, error => {
      console.log(error);
    })
  }

  getPostGroupKey(post:Post):string{
    var dateSplit=post.CreatedOn.split('/');
    const d = new Date(+dateSplit[2],+dateSplit[0]-1,+dateSplit[1]);
    let month= this.monthNames[d.getMonth()];
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
  //end create text post

  //start gallery post upload
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
      this.postGalleryForm.get('image').setValue(file);
    }
  }

  saveGalleryPost(postData){
    const formData = new FormData();
    formData.append('file', this.postGalleryForm.get('image').value);

    let galleryPost={
      image:formData,
      webUrl:postData.webUrl,
      UserId:this.loggedInUserInfo.UserId
    };
    this.profileInfoService.postGallery(galleryPost)
    .subscribe((res: any) => {
      this.getUserPosts();
      this.resetPostGalleryForm();
    }, error => {
      console.log(error);
    })
  }
  //end gallery post upload
}
