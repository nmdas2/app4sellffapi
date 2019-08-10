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

  userPosts: any;
  PostsByGroups:PostByGroup[]=[];
  loggedInUserInfo: User;
  constructor(
    private profileInfoService: ProfileinfoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
  ) { 
    this.userPosts = [];
    this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.createPostTextForm();
    this.getUserPosts();
    
  }

  //get user posts
  getUserPosts(){
    this.userPosts = [];
    this.profileInfoService.getUserPosts(this.loggedInUserInfo.UserId)
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
}
