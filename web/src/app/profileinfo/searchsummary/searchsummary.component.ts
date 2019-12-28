import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
  tempSearchResults: searchRes[];
  userTrackerSub = new Subscription;
  loggedInUserInfo: User;
  currentProfileId: number;
  searchProfileId: number;
  srchType: number;
  srchParam: string;
  hasSession: boolean = false;
  readonlyUserInfo: ProfileInfo;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  sortDirection: string = 'asc';



  constructor(private pfrlsrvs: ProfileinfoService,
    private router: Router,
    private aroute: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.tempSearchResults = [];
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
      this.srchType = key && key.searchType ? key.searchType : 0;
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
        //this.router.navigate([consts.AboutPath]);
        this.router.navigate(["/" + this.readonlyUserInfo.DisplayName + consts.AboutPath]);
      }
      else {
        localStorage.setItem('profileviewUser', JSON.stringify(this.readonlyUserInfo));
        //this.router.navigate([consts.AboutPath]);
        this.router.navigate(["/" + this.readonlyUserInfo.DisplayName + consts.AboutPath]);
        this.commonService.isProfileSelected.next(true);
      }
    }
    else {
      localStorage.setItem('profileviewUser', JSON.stringify(this.readonlyUserInfo));
      //this.router.navigate([consts.AboutPath]);
      this.router.navigate(["/" + this.readonlyUserInfo.DisplayName + consts.AboutPath]);
      this.commonService.isProfileSelected.next(true);
    }
    this.commonService.socialAndHeaderWidgetsTracker.next(true);
  }

  sortingSearch(field: string) {
    this.sortDirection = this.sortDirection == 'asc' ? 'des' : 'asc';
    if (this.tempSearchResults && this.tempSearchResults.length > 0) {

      this.tempSearchResults = this.tempSearchResults.sort((a, b) => {
        if (isNaN(a[field]) && isNaN(b[field])) {
          return this.commonService.sortStrings(a[field], b[field], this.sortDirection);
        }
        else {
          return this.commonService.sortNumbers(a[field], b[field], this.sortDirection);
        }
      })
    }

  }

  getSearchResult() {
    this.pfrlsrvs.getAdvancedSearchBySearchTerm(this.srchType, this.srchParam)
      .subscribe(res => {
        if (res && res.length > 0) {
          this.searchResults = res;
          this.pageChanged({ page: this.currentPage, itemsPerPage: this.itemsPerPage })
        }
        else {
          this.searchResults = [];
          this.tempSearchResults = [];
        }
      });
  }

  pageChanged(event) {
    this.currentPage = event.page - 1
    let itemsPerPage = event.itemsPerPage;
    this.tempSearchResults = this.searchResults.slice((this.currentPage) * itemsPerPage, (this.currentPage + 1) * itemsPerPage);
  }
}
