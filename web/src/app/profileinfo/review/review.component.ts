import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { Review } from 'src/app/_models/review';
import { Router } from '@angular/router';
import { constants as consts } from '../../constants';
import { ReadOnlyInfo } from 'src/app/_models/readonlyinfo';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {  
  max = 5;   rate = 0; communicationRate=0;  QOWRate=0; isReadonly = false;   overStar: number | undefined; percent: number; 
  ViewUserInfo: User;  modalRef: BsModalRef; loggedInUserInfo: User;  ratingGivenTo: number;  reviewUserForm: FormGroup
  canReview: boolean = false;  idToGetReviews:number; userReviews: Review[]; searchProfileUserId: number = 0; currentRating: Review;
  readonlyUserInfo: ReadOnlyInfo; submitted = false; totalRatings: number = 0;
  constructor(
    private profileInfoService: ProfileinfoService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    ) { 
      this.SetLocalStorageInfo();
    }

  ngOnInit() {
      this.reviewUserForm = this.formBuilder.group({
        reviewTitle: ['', Validators.required],
        reviewContent: ['', Validators.required]
    });
    this.getUserReviews(this.loggedInUserInfo);
    this.FilterListForCurrentuserRating(this.idToGetReviews);
  }
  FilterListForCurrentuserRating(idToGetReviews: number) {
    this.profileInfoService.GetCurrentUserRatingById(idToGetReviews)
    .subscribe((res: any) => {
      this.currentRating = res;
      this.totalRatings = this.currentRating.Starts5 + this.currentRating.Starts4 + this.currentRating.Starts3 + this.currentRating.Starts2 + this.currentRating.Starts1
    }, error => {
      console.log(error);
    })
  }
  // convenience getter for easy access to form fields
  get f() { return this.reviewUserForm.controls; }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  hoveringOver(value: number): void {
    this.overStar = value;
    this.percent = (value / this.max) * 100;
  } 
  resetStar(): void {
    this.overStar = void 0;
  }
  onSubmit() {
    if (this.reviewUserForm.invalid) {
        return;
    }
    let postReview:Review={
      ReviewTitle:this.reviewUserForm.value.reviewTitle,
      ReviewContent:this.reviewUserForm.value.reviewContent,
      UserId:this.loggedInUserInfo.UserId,
      Rating: this.rate,
      RatingGivenTo: this.searchProfileUserId,
      Performance: this.rate,
      Communication: this.communicationRate,
      QOW: this.QOWRate,
    };
    this.profileInfoService.SaveReview(postReview)
    .subscribe((res: any) => {
      this.getUserReviews(this.loggedInUserInfo);
      this.onReset();
    }, error => {
      console.log(error);
    })
}
  getUserReviews(idToGetReviews: User) {
    this.profileInfoService.GetUserReviewsById(idToGetReviews)
    .subscribe((res: any) => {
      if(res && res.length)
        this.userReviews = res;
    }, error => {
      console.log(error);
    })
  }
  onReset(){
    this.modalRef.hide();
    this.reviewUserForm.reset();
  }
  SetLocalStorageInfo() {
    if(localStorage.getItem('currentUser') != null){
      this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      this.idToGetReviews = this.loggedInUserInfo.UserId; 
    }
    if(localStorage.getItem('profileviewUser') != null){
      this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
      this.idToGetReviews = this.readonlyUserInfo.roUserId;
      this.searchProfileUserId = this.readonlyUserInfo.roUserId;
      this.canReview = true;
    }
  }

  openotherprofile(RefsearchUserIdBo){
    localStorage.removeItem('profileviewUser');
    this.readonlyUserInfo = <ReadOnlyInfo>{};
    this.readonlyUserInfo.roUserId = RefsearchUserIdBo.UserId;
    this.readonlyUserInfo.roProfilePicPath = RefsearchUserIdBo.ProfilePicPath;
    this.readonlyUserInfo.roRank = RefsearchUserIdBo.Rank;
    this.readonlyUserInfo.roDisplayName = RefsearchUserIdBo.DisplayName;
    RefsearchUserIdBo.ViewingSearchProfile = true;
    localStorage.setItem('profileviewUser', JSON.stringify(this.readonlyUserInfo));
    this.ViewUserInfo.ViewingSearchProfile = true;
    this.router.navigate([consts.AboutPath]);
  }

  sayhelpful()  {

  }
  resetPostTextForm(){

  }

}
