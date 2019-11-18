import { CommonService } from 'src/app/_services/common.service';
import { Injectable, EventEmitter } from '@angular/core';
import { ProfileInfo } from '../_models/profileinfo';
import { constants as consts } from './../constants';

declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private connection: any;
  private proxy: any;

  constructor(private commonService:CommonService) {
    
   }

  public initializeSignalRConnection(): void {    
    
    this.connection = $.hubConnection(`${consts.SignalRURL}`);
    this.proxy = this.connection.createHubProxy('NotificationHub');

    // register on server events  
    this.registerOnServerEvents();
    // call the connecion start method to start the connection to send and receive events.  
    this.startConnection();

  }

  // method to hit from client  
  public sendUserInfo(userId: number) {
    this.startConnection();
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('GetUserNotification', userId);
  }

  // check in the browser console for either signalr connected or not  
  private startConnection(): void {
    this.connection.start().done((data: any) => {
      console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
      //this.connectionEstablished.emit(true);
      //this.connectionExists = true;
    }).fail((error: any) => {
      console.log('Could not connect ' + error);
      //this.connectionEstablished.emit(false);
    });
  }

  private  registerOnServerEvents(): void {
    this.proxy.on('SetUserNotification', (data: ProfileInfo) => {
      console.log('received in SignalRService: ' + JSON.stringify(data));
      this.commonService.userNotifications.next(data);
      // this.messageReceived.emit(data);
    });
  }
}
