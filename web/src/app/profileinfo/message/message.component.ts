import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { Router } from '@angular/router';
import { constants as consts } from '../../constants';
import { CommonService } from 'src/app/_services/common.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  userMessages: ProfileInfo[];  userMsg: string;  isSubmitted: boolean = false; loggedInUserInfo: ProfileInfo; 
  isAboutInEditMode: boolean = false; usersCommMessages: ProfileInfo[]; readonlyUserInfo: ProfileInfo;
  showcommunicationbox: boolean = false; guestIdToSendMessage: number=0; messageDisplayName: string="";
  dataDisplayProfile: ProfileInfo;
  constructor(private profileInfoService: ProfileinfoService, 
    private router: Router,
    private commonService: CommonService)
  {  }

  ngOnInit() {   
    if(localStorage.getItem('currentUser') != null){
      this.dataDisplayProfile = this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      this.isAboutInEditMode = true;
    }
    if(localStorage.getItem('profileviewUser') != null){
      this.dataDisplayProfile = this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
      this.isAboutInEditMode = false;
    }
    this.getAllUserMessages(); 
  }

  getAllUserMessages(){
    this.userMessages = [];
    if(this.isAboutInEditMode){
      this.profileInfoService.getAllUsersMessages(this.dataDisplayProfile.UserId)
      .subscribe(res =>{
        if(res && res.length)
          this.userMessages = res;
      }, error =>{
        console.log(error);
      })
    }
    else{
      this.profileInfoService.GetUserMessagesBetween2Users(this.dataDisplayProfile.UserId,this.loggedInUserInfo.UserId)
    .subscribe(res =>{
      if(res && res.length)
        this.userMessages = res;
    }, error =>{
      console.log(error);
    })
    }
  }
  sendMessage(){
    this.isSubmitted = true;
    if(this.userMsg){
      let messageInfo = <ProfileInfo>{};
      messageInfo.Message = this.userMsg;
      messageInfo.MessageSentTime = new Date().toDateString();
      messageInfo.UserId = this.loggedInUserInfo.UserId;
      if(this.guestIdToSendMessage > 0){
        messageInfo.userRefId = this.guestIdToSendMessage;
        this.guestIdToSendMessage = 0;
      }
      else{messageInfo.userRefId = this.dataDisplayProfile.UserId}
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
    localStorage.removeItem('profileviewUser');
    this.readonlyUserInfo = <ProfileInfo>{};
    this.profileInfoService.GetUserProfileInfoByUserId(RefsearchUserIdBo.MessageFrom)
    .subscribe(res => {
      localStorage.setItem('profileviewUser', JSON.stringify(res));
      console.log(res);
    }, error => {
      console.log(error);
    })    
    this.router.navigate([consts.AboutPath]);
    this.commonService.isProfileSelected.next(true);
  }
  showcommunication(messageFromId: number,messageToId: number, mdisName: string)
  {
    if(messageFromId != messageToId)
    {this.showcommunicationbox = true;
    this.messageDisplayName = mdisName;
    }
    this.guestIdToSendMessage = messageFromId;
  }
}
