import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';
import { constants as consts } from '../../constants';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  userMessages: ProfileInfo[];  userMsg: string;  isSubmitted: boolean = false; loggedInUserInfo: User; isAboutInEditMode: boolean = false;
  UserIdForGallery: number; MainUserId: number;

  constructor(private profileInfoService: ProfileinfoService, private router: Router)
  {
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
    this.getAllUserMessages();
  }

  ngOnInit() {    
  }

  getAllUserMessages(){
    this.userMessages = [];
    this.profileInfoService.getAllUsersMessages(this.UserIdForGallery)
    .subscribe(res =>{
      if(res && res.length)
        this.userMessages = res;
    }, error =>{
      console.log(error);
    })
    console.log(this.userMessages);
  }

  sendMessage(){
    this.isSubmitted = true;
    if(this.userMsg){
      let messageInfo = <ProfileInfo>{};
      messageInfo.Message = this.userMsg;
      messageInfo.MessageSentTime = new Date().toDateString();
      messageInfo.userId = this.MainUserId;
      messageInfo.userRefId = this.UserIdForGallery;
      this.profileInfoService.postUserMessage(messageInfo)
      .subscribe(res => {
        this.isSubmitted = false;
        this.userMsg = "";
        this.getAllUserMessages();
      }, error => {
        console.log(error);
      })
    }
  }

  openotherprofile(RefsearchUserIdBo){    
    RefsearchUserIdBo.UserRefProfileId = RefsearchUserIdBo.MessageFrom;
    RefsearchUserIdBo.ViewingSearchProfile = true;
    localStorage.setItem('profileviewUser', JSON.stringify(RefsearchUserIdBo));
    this.router.navigate([consts.AboutPath]);
  }

}
