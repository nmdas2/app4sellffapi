import { Component, OnInit ,ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { CommonService } from '../_services/common.service';
import { first } from 'rxjs/operators';
import { constants } from '../constants';

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
  successMsg: string = ''; //constants.forgetMsgSuccess;
  errorMsg: string = '';
  @ViewChild('UserName',{static: false}) inputEl:ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
  ) { }
  ngAfterViewInit() {
    setTimeout(() => this.inputEl.nativeElement.focus());
 }
 routrLogin(e){
   e.preventDefault();
  this.router.navigate(['/login']);
  setTimeout(function(){
    this.router.navigate(['/login']);
  },100)
 
 }
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
                this.successMsg = constants.forgetMsgSuccess;
                this.errorMsg = '';
                setTimeout(() => {
                  this.successMsg = '';
                }, 60000)
                this.commonService.loadingHide();
                this.loginForm.reset();
            },
            error => {
                this.commonService.loadingHide();
                console.log(error);
                this.errorMsg = constants.forgetMsgError;
                this.successMsg = '';
                setTimeout(() => {
                  this.errorMsg = '';
                }, 60000)
                this.loading = false;
            });
}

}
