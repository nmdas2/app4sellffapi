import { Component, OnInit, OnDestroy,ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first} from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';
import { CommonService } from '../_services/common.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    invalidLogin: boolean = false;
    stateMsg: string = "";
    regSub: Subscription;
    @ViewChild('UserName',{static: false}) inputEl:ElementRef;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private commonService: CommonService
    ) {
    }
    ngAfterViewInit() {
        setTimeout(() => this.inputEl.nativeElement.focus());
     }
     routrForgot(e){
        e.preventDefault();
       this.router.navigate(['/forgotpassword']);
      
      }
    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profileinfo/about';
        localStorage.removeItem('profileviewUser');
        this.commonService.isProfileSelected.next(false);
        this.commonService.socialAndHeaderWidgetsTracker.next(false);
        this.regSub = this.commonService.regSuccessMsg$.subscribe(msg => {
            this.stateMsg = msg;
        })
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        //this.authenticationService.login(this.f.username.value, this.f.password.value)
        this.commonService.loadingShow();
        console.log(this.loginForm.value)
        this.authenticationService.userAuthentication(this.loginForm.value.username, this.loginForm.value.password)
            .subscribe((data: any) => {
                localStorage.setItem('userToken', data.access_token);
                this.authenticationService.login(this.loginForm.value)
                    .pipe(first())
                    .subscribe(
                        (data: User) => {
                            this.commonService.loadingHide();
                            this.authenticationService.isLogin.next(true);
                            this.commonService.socialAndHeaderWidgetsTracker.next(true);
                            this.router.navigate(['/home']);
                        },
                        error => {
                            this.commonService.loadingHide();
                            console.log(error);
                            //this.alertService.error(error);
                            this.invalidLogin = true;
                            setTimeout(() => {
                                this.invalidLogin = false;
                            }, 10000)
                            this.loading = false;
                        });
            },
                (error: HttpErrorResponse) => {
                    this.commonService.loadingHide();
                    console.log(error);
                    //this.alertService.error(error);
                    this.invalidLogin = true;
                    setTimeout(() => {
                        this.invalidLogin = false;
                    }, 10000)
                    this.loading = false;
                });
    }

    ngOnDestroy(): void {
       if(this.regSub) this.regSub.unsubscribe();
    }
}