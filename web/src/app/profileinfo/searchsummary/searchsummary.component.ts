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
  hasSession: boolean = false;
  
  constructor(private pfrlsrvs: ProfileinfoService,
    private router: Router,
    private aroute: ActivatedRoute) { 
    if(localStorage.getItem('currentUser') != null){
      this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      this.currentProfileId = this.loggedInUserInfo.UserId;
      this.searchProfileId = this.loggedInUserInfo.UserRefProfileId;
      this.hasSession = true;
    }
    else{
      //this.router.navigate([this.returnUrl]);
    }
  }
 
  ngOnInit() {
    this.aroute.params.subscribe(p=>{
        let key=p;
        this.srchParam = p.shashval;
    });

    this.pfrlsrvs.getUsersBySearchTerm(this.srchParam)
      .subscribe(res => {
        this.searchResults = res;
      });
  }

  ngOnDestroy() {
    this.userTrackerSub.unsubscribe();
  }

  openotherprofile(RefsearchUserIdBo){    
    RefsearchUserIdBo.UserRefProfileId = RefsearchUserIdBo.UserId;
    RefsearchUserIdBo.ViewingSearchProfile = true;
    localStorage.setItem('profileviewUser', JSON.stringify(RefsearchUserIdBo));
    this.router.navigate([consts.AboutPath]);
  }

}
