import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { CommonService } from '../_services/common.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  invalidLogin: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
      username: ['', Validators.required]
      });
      localStorage.removeItem('profileviewUser');
      this.commonService.isProfileSelected.next(false);
      this.commonService.socialAndHeaderWidgetsTracker.next(false);
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
        return;
    }
    this.loading = true;
    this.commonService.loadingShow();
    //console.log(this.loginForm.value.username);
    this.authenticationService.forgotpasswordinfo(this.loginForm.value.username)
        .subscribe(
            (data) => {
              
                this.commonService.loadingHide();
            },
            error => {
                this.commonService.loadingHide();
                console.log(error);
                this.invalidLogin = true;
                setTimeout(() => {
                    this.invalidLogin = false;
                }, 10000)
                this.loading = false;
            });
}

}
