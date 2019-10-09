import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CommonService } from 'src/app/_services/common.service';
import { ProfileInfo } from 'src/app/_models/profileinfo';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  loginForm: FormGroup; loggedInUserInfo: ProfileInfo;
  loading = false;
  submitted = false;
  invalidLogin: boolean = false;
  successMsg: string = "";
  errorMsg: string = ""
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser') != null) {
      this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
    }
    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required],
      newpassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', Validators.required]
    }
      , {
        validator: this.MustMatch
      });
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.commonService.loadingShow();
    this.authenticationService.changepasswordinfo(this.loginForm.value.newpassword, this.loggedInUserInfo.UserId)
      .subscribe(
        (data) => {
          this.successMsg = "your password has been reset successfully";
          setTimeout(() => {
            this.successMsg = "";
          }, 60000);
          this.commonService.loadingHide();
        },
        error => {
          this.commonService.loadingHide();
          console.log(error);
          if (error.status == 500) {
            this.errorMsg = "something went wrong";
            setTimeout(() => {
              this.errorMsg = "";
            }, 60000)
          }
          else {
            this.errorMsg = "current password is invalid, please enter valid current password";
            setTimeout(() => {
              this.errorMsg = "";
            }, 60000)
          }
          this.loading = false;
        });
  }
  MustMatch(formGroup: FormGroup) {
    let pass = formGroup.controls.newpassword.value;
    let confirmPass = formGroup.controls.confirmpassword.value;
    // set error on matchingControl if validation fails
    return pass === confirmPass ? null : { mustMatch: true }
  }
}
