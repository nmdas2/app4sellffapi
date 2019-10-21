import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { Review } from 'src/app/_models/review';
import { Router } from '@angular/router';
import { constants as consts } from '../../constants';
import { ReadOnlyInfo } from 'src/app/_models/readonlyinfo';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { CommonService } from 'src/app/_services/common.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  
  ratefive: number = 0;
  max = 5; rate = 0; communicationRate = 0; QOWRate = 0; isReadonly = false; overStar: number | undefined; percent: number;
  ViewUserInfo: User; modalRef: BsModalRef; loggedInUserInfo: ProfileInfo; ratingGivenTo: number; reviewUserForm: FormGroup
  canReview: boolean = false; idToGetReviews: number; userReviews: Review[]; searchProfileUserId: number = 0; currentRating: Review;
  readonlyUserInfo: ProfileInfo; submitted = false; totalRatings: number = 0; dataDisplayProfile: ProfileInfo; reviewAlreadyGiven: boolean = false;
  loggedInUserId: number = 0;
  isValidRating: boolean = false;
  dismissible = true;
  timeOut = 30000;
  constructor(
    private profileInfoService: ProfileinfoService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.SetLocalStorageInfo();
    this.reviewUserForm = this.formBuilder.group({
      reviewTitle: ['', Validators.required],
      reviewContent: ['', Validators.required]
    });
    if (this.loggedInUserInfo) { this.loggedInUserId = this.loggedInUserInfo.UserId }
    this.getUserReviews(this.dataDisplayProfile.UserId, this.loggedInUserId);
    this.FilterListForCurrentuserRating(this.dataDisplayProfile.UserId);
  }
  FilterListForCurrentuserRating(idToGetReviews: number) {
    this.profileInfoService.GetCurrentUserRatingById(idToGetReviews)
      .subscribe((res: any) => {
        this.currentRating = res;
        this.totalRatings = this.currentRating.Starts5 + this.currentRating.Starts4 + this.currentRating.Starts3 + this.currentRating.Starts2 + this.currentRating.Starts1
        this.ratefive = this.currentRating.TotalRatingsCount;
      }, error => {
        console.log(error);
      })
  }
  // convenience getter for easy access to form fields
  get f() { return this.reviewUserForm.controls; }
  openModal(template: TemplateRef<any>) {
    //this.modalRef = this.modalService.show(template);
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  hoveringOver(value: number): void {
    this.overStar = value;
    this.percent = (value / this.max) * 100;
  }
  resetStar(): void {
    this.overStar = void 0;
  }
  onSubmit() {
    this.submitted = true;
    if (this.reviewUserForm.invalid || !this.checkRating()) {
      return;
    }
    let postReview: Review = {
      ReviewTitle: this.reviewUserForm.value.reviewTitle,
      ReviewContent: this.reviewUserForm.value.reviewContent,
      UserId: this.loggedInUserInfo.UserId,
      Rating: this.rate,
      RatingGivenTo: this.dataDisplayProfile.UserId,
      Performance: this.rate,
      Communication: this.communicationRate,
      QOW: this.QOWRate,
    };
    this.profileInfoService.SaveReview(postReview)
      .subscribe((res: any) => {
        this.getUserReviews(this.dataDisplayProfile.UserId, this.loggedInUserId);
        this.FilterListForCurrentuserRating(this.dataDisplayProfile.UserId);
        this.onReset();
      }, error => {
        console.log(error);
      })
  }
  getUserReviews(idToGetReviews: number, loggedInUserId: number) {
    this.profileInfoService.GetUserReviewsById(idToGetReviews, this.loggedInUserId)
      .subscribe((res: any) => {
        if (res && res.length)
          this.userReviews = res;
        if(this.userReviews && this.userReviews.length > 0)
          this.reviewAlreadyGiven = this.userReviews[0].ReviewAlreadyGiven;
      }, error => {
        console.log(error);
      })
  }
  onReset() {
    this.modalRef.hide();
    this.submitted = false;
    this.isValidRating = false;
    this.rate = 0;
    this.communicationRate = 0;
    this.QOWRate = 0;
    this.reviewUserForm.reset();
  }
  SetLocalStorageInfo() {
    if (localStorage.getItem('currentUser') != null) {
      this.dataDisplayProfile = this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
    }
    if (localStorage.getItem('profileviewUser') != null) {
      this.dataDisplayProfile = this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
    }
    if (this.loggedInUserInfo && this.readonlyUserInfo) { this.canReview = true; }
  }

  openotherprofile(RefsearchUserIdBo) {
    localStorage.removeItem('profileviewUser');
    this.readonlyUserInfo = <ProfileInfo>{};
    this.profileInfoService.GetUserProfileInfoByUserId(this.dataDisplayProfile.UserId)
      .subscribe(res => {
        localStorage.setItem('profileviewUser', JSON.stringify(res));
      }, error => {
        console.log(error);
      })
    this.router.navigate([consts.AboutPath]);
    this.commonService.isProfileSelected.next(true);
    this.commonService.socialAndHeaderWidgetsTracker.next(true);
  }
  sayhelpful(review: Review) { 
    this.commonService.loadingShow();
    let reviewObj = review;
    reviewObj.CreatedIP = '127.0.0.1';
    this.profileInfoService.updateHelpfulCount(reviewObj)
    .subscribe(res => {
      this.commonService.loadingHide();
      this.getUserReviews(this.dataDisplayProfile.UserId, this.loggedInUserId);
    }, error => {
      this.commonService.loadingHide();
    })
  }
  resetPostTextForm() { }

  checkRating(): boolean{
    
    this.isValidRating = false;
    if(this.rate > 0 && this.communicationRate > 0 && this.QOWRate > 0){
      this.isValidRating = true;
    }

    return this.isValidRating;
  }
}
