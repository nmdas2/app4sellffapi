import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileinfoService, searchRes } from 'src/app/_services/profileinfo.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { constants as consts } from '../../constants';
import { CommonService } from 'src/app/_services/common.service';
import { ProfileInfo } from 'src/app/_models/profileinfo';

@Component({
  selector: 'app-searchsummary',
  templateUrl: './searchsummary.component.html',
  styleUrls: ['./searchsummary.component.scss']
})
export class SearchsummaryComponent implements OnInit, OnDestroy {
  returnUrl: string = "/home";
  searchResults: searchRes[];
  userTrackerSub = new Subscription;
  loggedInUserInfo: User;
  currentProfileId: number;
  searchProfileId: number;
  srchParam: string;
  hasSession: boolean = false;
  readonlyUserInfo: ProfileInfo;

  constructor(private pfrlsrvs: ProfileinfoService,
    private router: Router,
    private aroute: ActivatedRoute,
    private commonService: CommonService
  ) {

  }
  ngOnInit() {
    this.commonService.isSummaryPage.next(true);
    if (localStorage.getItem('currentUser')) {
      this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      this.currentProfileId = this.loggedInUserInfo.UserId;
      this.searchProfileId = this.loggedInUserInfo.UserRefProfileId;
      this.hasSession = true;
    } else { }
    localStorage.removeItem('profileviewUser');
    this.commonService.isProfileSelected.next(false);
    this.commonService.socialAndHeaderWidgetsTracker.next(true);
    this.aroute.queryParams.subscribe(params => {
      let key = params;
      this.srchParam = key && key.searchTerm ? key.searchTerm : '';
      this.searchResults = [];
      this.getSearchResult();
    });

  }
  ngOnDestroy() {
    this.userTrackerSub.unsubscribe();
    this.commonService.isSummaryPage.next(false);
  }
  openotherprofile(RefsearchUserIdBo) {
    this.readonlyUserInfo = <ProfileInfo>{};
    this.readonlyUserInfo = RefsearchUserIdBo;
    if (localStorage.getItem('currentUser')) {
      let user = JSON.parse(localStorage.getItem('currentUser'));
      if (user.UserId == this.readonlyUserInfo.UserId) {
        this.commonService.isProfileSelected.next(false);
        this.router.navigate([consts.AboutPath]);
      }
      else {
        localStorage.setItem('profileviewUser', JSON.stringify(this.readonlyUserInfo));
        this.router.navigate([consts.AboutPath]);
        this.commonService.isProfileSelected.next(true);
      }
    }
    else{
      localStorage.setItem('profileviewUser', JSON.stringify(this.readonlyUserInfo));
      this.router.navigate([consts.AboutPath]);
      this.commonService.isProfileSelected.next(true);
    }
    this.commonService.socialAndHeaderWidgetsTracker.next(true);
  }

  getSearchResult() {
    this.pfrlsrvs.getUsersBySearchTerm(this.srchParam)
      .subscribe(res => {
        this.searchResults = res;
      });
  }

}
