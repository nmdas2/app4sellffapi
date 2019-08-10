import { Component, OnInit } from '@angular/core';
import { ProfileinfoService, searchRes } from 'src/app/_services/profileinfo.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { constants as consts } from '../../constants';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-searchsummary',
  templateUrl: './searchsummary.component.html',
  styleUrls: ['./searchsummary.component.scss']
})
export class SearchsummaryComponent implements OnInit {
  returnUrl: string = "/home";
  searchResults: searchRes[];
  userTrackerSub = new Subscription;
  loggedInUserInfo: User;
  currentProfileId: number;
  searchProfileId: number;
  srchParam: string;
  
  constructor(private pis: ProfileinfoService,
    private router: Router,
    private aroute: ActivatedRoute) { 
    if(localStorage.getItem('currentUser') != null){
      this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      console.log(this.loggedInUserInfo);
      this.currentProfileId = this.loggedInUserInfo.UserId;
      this.searchProfileId = this.loggedInUserInfo.UserRefProfileId;
    }
    else{
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit() {
    this.aroute.queryParams.subscribe(params => {
      this.srchParam = params['shashval'];
      console.log(this.srchParam); // Print the parameter to the console. 
  });

    this.pis.getUsersBySearchTerm(this.srchParam)
      .subscribe(res => {
        this.searchResults = res;
      });
  }

  ngOnDestroy() {
    this.userTrackerSub.unsubscribe();
  }

  openotherprofile(RefsearchUserId){
    console.log(RefsearchUserId);
    this.searchProfileId = RefsearchUserId;
    this.loggedInUserInfo.UserRefProfileId = RefsearchUserId;
    this.loggedInUserInfo.ViewingSearchProfile = true;
    localStorage.setItem('currentUser', JSON.stringify(this.loggedInUserInfo));
    console.log(this.loggedInUserInfo);
    //this.router.navigate([consts.AboutPath]);
  }

}
