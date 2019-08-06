import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';

@Component({
  selector: 'app-promote',
  templateUrl: './promote.component.html',
  styleUrls: ['./promote.component.scss']
})
export class PromoteComponent implements OnInit {

  userPromotions: any;
  constructor(
    private profileInfoService: ProfileinfoService
  ) { 
    this.userPromotions = [];
  }

  ngOnInit() {
    this.getAllUserPromotions();
  }

  getAllUserPromotions(){
    this.userPromotions = [];
    this.profileInfoService.getAllUserPromotions(1)
    .subscribe(res => {
      if(res && res.length)
        this.userPromotions = res;
    }, error => {
      console.log(error);
    })
  }

}
