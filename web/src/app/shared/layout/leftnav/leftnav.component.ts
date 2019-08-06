import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.scss']
})
export class LeftnavComponent implements OnInit {
  hasUserInfo: any;

  constructor() { }

  ngOnInit() {
    if (window.localStorage && localStorage.length > 0) {
      let item = JSON.parse(localStorage.getItem('currentUser'));
      if(item.UserId>0)
      {this.hasUserInfo = true}
    }
  }

}
