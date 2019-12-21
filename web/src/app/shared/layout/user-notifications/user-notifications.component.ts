import { CommonService } from 'src/app/_services/common.service';
import { Component, OnInit, Input } from '@angular/core';
import { ProfileInfo } from 'src/app/_models/profileinfo';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {
@Input() notificationData:ProfileInfo;
  constructor(private commonService:CommonService) { }

  ngOnInit() {    
    this.commonService.userNotifications$.subscribe(res => {
      let currentUserId = 0, profileViewUserId=0;
      if (localStorage.getItem('currentUser')) {        
        currentUserId = JSON.parse(localStorage.getItem('currentUser')).UserId;
      }
      if (localStorage.getItem('profileviewUser')) {        
        profileViewUserId = JSON.parse(localStorage.getItem('profileviewUser')).UserId;
      }     
      if (currentUserId == res.UserId || profileViewUserId == res.UserId) {
        this.notificationData = res;
      }
      
    })
  }

}
