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
      let userId = 0;
      if (localStorage.getItem('currentUser')) {        
        userId = JSON.parse(localStorage.getItem('currentUser')).UserId;
      }
      if (localStorage.getItem('profileviewUser')) {        
        userId = JSON.parse(localStorage.getItem('profileviewUser')).UserId;
      }
      if (userId == res.UserId) {
        console.log(res);
        this.notificationData = res;
      }
      
    })
  }

}
