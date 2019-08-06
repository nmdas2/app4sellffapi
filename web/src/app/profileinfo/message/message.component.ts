import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { ProfileInfo } from 'src/app/_models/profileinfo';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  userMessages: ProfileInfo[];
  userMsg: string;
  isSubmitted: boolean = false;

  constructor(
    private profileInfoService: ProfileinfoService
  ) { 
    this.userMessages = [];
  }

  ngOnInit() {
    this.getAllUserMessages();
  }

  getAllUserMessages(){
    this.userMessages = [];
    this.profileInfoService.getAllUsersMessages(1)
    .subscribe(res =>{
      if(res && res.length)
        this.userMessages = res;
    }, error =>{
      console.log(error);
    })
  }

  sendMessage(){
    this.isSubmitted = true;
    if(this.userMsg){
      let messageInfo = <ProfileInfo>{};
      messageInfo.message = this.userMsg;
      messageInfo.displayName = 'Test';
      messageInfo.messageSentTime = new Date().toDateString();
      messageInfo.userId = 1;
      messageInfo.userRefId = 2;
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

}
