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
      console.log(res);
      this.notificationData = res;
    })
  }

}
