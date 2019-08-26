import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';
import { User } from '../_models/user';
import { CommonService } from '../_services/common.service';
import { AlertComponent } from 'ngx-bootstrap';


@Component({ 
    templateUrl: 'login.component.html',
    styleUrls:[ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    invalidLogin: boolean = false;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private commonService: CommonService
    ) {
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
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        //this.authenticationService.login(this.f.username.value, this.f.password.value)
        this.commonService.loadingShow();
        this.authenticationService.login(this.loginForm.value)
            .pipe(first())
            .subscribe(
                (data: User) => {
                    this.commonService.loadingHide();
                    this.authenticationService.isLogin.next(true);

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
    }
}