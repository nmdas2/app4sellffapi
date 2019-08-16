import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { Review } from 'src/app/_models/review';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  max = 10;
  rate = 7;
  isReadonly = false; 
  overStar: number | undefined;
  percent: number;
  modalRef: BsModalRef;
  loggedInUserInfo: User;
  ratingGivenTo: number;
  reviewUserForm: FormGroup
  
  constructor(
    private profileInfoService: ProfileinfoService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
    ) { }

  ngOnInit() {
      this.reviewUserForm = this.formBuilder.group({
        reviewTitle: ['', Validators.required],
        reviewContent: ['', Validators.required]
    });
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
      RatingGivenTo: this.ratingGivenTo,
    };
    this.profileInfoService.SaveReview(postReview)
    .subscribe((res: any) => {
      //this.getUserPosts();
      this.onReset();
    }, error => {
      console.log(error);
    })

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
}


  onReset(){
    this.modalRef.hide();
    this.reviewUserForm.reset();
  }
  savePost(postData){
    let post:Review={
      ReviewTitle:postData.title,
      ReviewContent:postData.text,
      UserId:this.loggedInUserInfo.UserId,
      Rating: this.rate,
      RatingGivenTo: this.ratingGivenTo,
    };
    // this.profileInfoService.postText(post)
    // .subscribe((res: any) => {
    //   //this.getUserPosts();
    //   this.resetPostTextForm();
    // }, error => {
    //   console.log(error);
    // })
  }

}
