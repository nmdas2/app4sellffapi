import { SignalRService } from './../../_services/signal-r.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { Router } from '@angular/router';
import { constants as consts } from '../../constants';
import { CommonService } from 'src/app/_services/common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  userMessages: ProfileInfo[]; userMsg: string; isSubmitted: boolean = false; loggedInUserInfo: ProfileInfo;
  isAboutInEditMode: boolean = false; usersCommMessages: ProfileInfo[]; readonlyUserInfo: ProfileInfo;
  showcommunicationbox: boolean = false; guestIdToSendMessage: number = 0; messageDisplayName: string = "";
  dataDisplayProfile: ProfileInfo; modalRef: BsModalRef;
  successMsg: string; isnameclickable: boolean = true;
  errorMsg: string
  constructor(private profileInfoService: ProfileinfoService,
    private router: Router,
    private modalService: BsModalService,
    private commonService: CommonService,
    private signalRService:SignalRService) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser') != null) {
      this.dataDisplayProfile = this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      this.isAboutInEditMode = true;
    }
    if (localStorage.getItem('profileviewUser') != null) {
      this.dataDisplayProfile = this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
      this.isAboutInEditMode = false;
    
    }
    this.getAllUserMessages();

    this.commonService.userMessages$.subscribe(res => {     
      let userId = 0;
      if (localStorage.getItem('currentUser')) {
        userId = JSON.parse(localStorage.getItem('currentUser')).UserId;

      }
      if (localStorage.getItem('profileviewUser')) {
        userId = JSON.parse(localStorage.getItem('profileviewUser')).UserId;

      }
      
      if (userId == res.userId) {
        this.userMessages = res
      }
    });
  }

  getAllUserMessages() {
    this.userMessages = [];
    if (this.isAboutInEditMode) {
      this.profileInfoService.getAllUsersMessages(this.dataDisplayProfile.UserId)
        .subscribe(res => {
          if (res && res.length)
            this.userMessages = res;
        }, error => {
          console.log(error);
        })
    }
    else {
      this.profileInfoService.GetUserMessagesBetween2Users(this.dataDisplayProfile.UserId, (this.loggedInUserInfo)?this.loggedInUserInfo.UserId:0)
        .subscribe(res => {
          if (res && res.length)
            this.userMessages = res;
        }, error => {
          console.log(error);
        })
    }
  }
  sendMessage() {
    this.isSubmitted = true;
    if (this.userMsg) {
      let messageInfo = <ProfileInfo>{};
      messageInfo.Message = this.userMsg;
      messageInfo.MessageSentTime = new Date().toDateString();
      messageInfo.UserId = this.loggedInUserInfo.UserId;
      if (this.guestIdToSendMessage > 0) {
        messageInfo.userRefId = this.guestIdToSendMessage;
        //this.guestIdToSendMessage = 0;
      }
      else { messageInfo.userRefId = this.dataDisplayProfile.UserId }
      this.profileInfoService.postUserMessage(messageInfo)
        .subscribe(res => {
          this.isSubmitted = false;
          this.userMsg = "";
          debugger;
          this.signalRService.SendUserUnReadMessagesCount(messageInfo.userRefId);
          this.signalRService.SendUserMessagesInfo(messageInfo.userRefId);
          // this.successMsg = "Your message has been submitted successfully";
          // setTimeout(() => {
          //   this.successMsg = "";
          // }, 10000);
          if(this.loggedInUserInfo.UserId == this.dataDisplayProfile.UserId)
            this.displaycommessages(this.loggedInUserInfo.UserId,messageInfo.userRefId,0);
          else
            this.getAllUserMessages();
        }, error => {
          this.errorMsg = "Error occured";
          setTimeout(() => {
            this.errorMsg = "";
          }, 10000);
          console.log(error);
        })
    }
  }
  openotherprofile(RefsearchUserIdBo) {
    localStorage.removeItem('profileviewUser');
    this.readonlyUserInfo = <ProfileInfo>{};
    this.profileInfoService.GetUserProfileInfoByUserId(RefsearchUserIdBo.MessageFrom)
      .subscribe(res => {
        if (localStorage.getItem('currentUser')) {
          let user = JSON.parse(localStorage.getItem('currentUser'));
          if (user.UserId == res.UserId) {
            //this.router.navigate([consts.AboutPath]);
            this.router.navigate(["/"+this.readonlyUserInfo.DisplayName+consts.AboutPath]);
            this.commonService.isProfileSelected.next(false);
          }
          else {
            localStorage.setItem('profileviewUser', JSON.stringify(res));
            this.router.navigate([consts.AboutPath]);
            this.commonService.isProfileSelected.next(true);
          }
        }
        else {
          localStorage.setItem('profileviewUser', JSON.stringify(res));
          this.router.navigate([consts.AboutPath]);
          this.commonService.isProfileSelected.next(true);
        }

        this.commonService.socialAndHeaderWidgetsTracker.next(true);
        console.log(res);
      }, error => {
        console.log(error);
      })
  }
  showcommunication(messageFromId: number, messageToId: number, mdisName: string) {
    if (messageFromId != messageToId) {
      this.showcommunicationbox = true;
      this.messageDisplayName = mdisName;
    }
    this.guestIdToSendMessage = messageFromId;
    this.displaycommessages(messageFromId,messageToId,1);
    this.getAllUserMessages();
  }

  displaycommessages(messageFromId: number, messageToId: number,readNotReq: number)
  {
    this.profileInfoService.GetHistoryUserId(messageToId, messageFromId,readNotReq)
        .subscribe(res => {
          if (res && res.length)
            this.usersCommMessages = res;
            this.commonService.MessagesReadTracker.next(true);
        }, error => {
          console.log(error);
        })
  }

  showpreviousmessages(messageFromId: number, messageToId: number, mdisName: string, template: TemplateRef<any>) {
    this.profileInfoService.GetHistoryUserId(messageToId, messageFromId,1)
        .subscribe(res => {
          if (res && res.length)
            this.usersCommMessages = res;
            this.modalRef = this.modalService.show(template);
            this.commonService.MessagesReadTracker.next(true);
        }, error => {
          console.log(error);
        })
    if (messageFromId != messageToId) {      
    }
  }
}
