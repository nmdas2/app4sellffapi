import { CommonService } from 'src/app/_services/common.service';
import { Injectable, NgZone } from '@angular/core';
import { ProfileInfo } from '../_models/profileinfo';
import { constants as consts } from './../constants';
import { UserShareDetailsBO } from './profileinfo.service';

declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private connection: any;
  private proxy: any;

  constructor(
    private commonService: CommonService,
    private ngZone: NgZone) {
    this.initializeSignalRConnection();
  }

  public initializeSignalRConnection(): void {
    this.connection = $.hubConnection(`${consts.SignalRURL}`);
    this.proxy = this.connection.createHubProxy('NotificationHub');
    // register on server events  
    this.GetUserNotificationInfo();
    this.GetUserPostInfo();
    this.GetUserReviewInfo();
    this.GetUserReviewRatingsInfo();
    this.GetUserUnReadMessagesCount();
    this.GetUserMessagesInfo();
    this.GetUserInvestmentInfo();
    this.GetUserGraphInvestmentInfo();
    // call the connecion start method to start the connection to send and receive events.  
    this.startConnection();

  }
  // check in the browser console for either signalr connected or not  
  private startConnection(): void {
    this.connection.start().done((data: any) => {
      console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
    }).fail((error: any) => {
      console.log('Could not connect ' + error);
    });
  }
  // method to hit from client  
  public SendUserNotificationInfo(userId: number) {
    //this.startConnection(); 
    this.proxy.invoke('GetUserNotification', userId);
  }

  private GetUserNotificationInfo(): void {
    this.proxy.on('SetUserNotification', (data: ProfileInfo) => {
      this.ngZone.run(() => this.commonService.userNotifications.next(data));
      // this.messageReceived.emit(data);
    });
  }

  // method to hit from client  
  public SendUserPostInfo(userId: number) {
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('GetUserPosts', userId);
  }

  private GetUserPostInfo(): void {
    this.proxy.on('SetUserPosts', (data: ProfileInfo) => {
      this.ngZone.run(() =>this.commonService.userPosts.next(data));
    });
  }

  // method to hit from client  
  public SendUserReviewInfo(displayUserID: number, userId: number) {
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('GetUserReview', displayUserID, userId);
  }

  private GetUserReviewInfo(): void {
    this.proxy.on('SetUserReview', (data: any) => {
      this.ngZone.run(() =>this.commonService.userReviews.next(data));
      // this.messageReceived.emit(data);
    });
  }

   // method to hit from client  
   public SendUserReviewRatingsInfo(userId: number) {
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('GetUserReviewRatings', userId);
  }

  private GetUserReviewRatingsInfo(): void {
    this.proxy.on('SetUserReviewRatings', (data: any) => {
      this.ngZone.run(() =>this.commonService.userReviewRatings.next(data));
      // this.messageReceived.emit(data);
    });
  }

  // method to hit from client  
  public SendUserInvestmentInfo(userId: number, profileId: number) {
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('GetUserInvestmentDetails', userId, profileId);
  }

  private GetUserInvestmentInfo(): void {
    this.proxy.on('SetUserInvestmentDetails', (data: any) => {
      this.ngZone.run(() => this.commonService.userInvestments.next(data));
    });
  }

  // method to hit from client  
  public SendUserGraphInvestmentInfo(userId: number) {
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('GetUserGraphDetails', userId);
  }

  private GetUserGraphInvestmentInfo(): void {
    this.proxy.on('SetUserGraphDetails', (data: UserShareDetailsBO[]) => {
      this.ngZone.run(() => this.commonService.userGraphInvestments.next(data));
    });
  }

  // method to hit from client  
  public SendUserUnReadMessagesCount(userId: number) {
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('GetUserUnReadMessagesCount', userId);
  }

  private GetUserUnReadMessagesCount(): void {
    this.proxy.on('SetUserUnReadMessagesCount', (userId:any,data: any) => {   
      let msgData = {
        userId: userId,
        msgUnReadCount:data
      }
      this.ngZone.run(() => this.commonService.userUnReadMessagesCount.next(msgData));
    });
  }

  // method to hit from client  
  public SendUserMessagesInfo(isEditMode:boolean,disPlayUserId: number,loggedInUserId:number) {
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('GetUserMessages', isEditMode,disPlayUserId,loggedInUserId);
  }

  private GetUserMessagesInfo(): void {
    this.proxy.on('SetUserMessages', (userId: any,data: any) => {      
      data.userId = userId;
      this.ngZone.run(() => this.commonService.userMessages.next(data));
    });
  }

}
