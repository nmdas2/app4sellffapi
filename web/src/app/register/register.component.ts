import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, max } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { UserService } from '../_services/user.service';
import { AlertService } from '../_services/alert.service';
import { CommonService } from '../_services/common.service';


@Component({ 
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    successMsg: string = '';
    errorMsg: string = '';
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private commonService: CommonService
    ) {
        //redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/profileinfo/about']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            displayName: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            age: ['', [Validators.required, Validators.min(1), Validators.max(130)]],
            city: ['', [Validators.required]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.userService.CheckIfUserExists(this.registerForm.value.email)
            .subscribe(
                data => {
                    if (data > 0) {
                        this.errorMsg = 'This user already registered with Sellff.';
                        setTimeout(() => {
                            this.errorMsg = "";
                        }, 10000)
                        this.alertService.success('This user already registered with Sellff.', true);
                        return;
                    }
                    else {
                        this.loading = true;
                        this.commonService.loadingShow();
                        this.userService.register(this.registerForm.value)
                            .pipe(first())
                            .subscribe(
                                data => {
                                    this.commonService.loadingHide();
                                    // this.successMsg = 'Registration successful';
                                    // setTimeout(() => {
                                    //     this.successMsg = "";
                                    // }, 10000)
                                    this.alertService.success('Registration successful', true, 10000);
                                    this.router.navigate(['/login']);
                                },
                                error => {
                                    this.commonService.loadingHide();
                                    this.errorMsg = 'Something went wrong. Please try after some time';
                                    setTimeout(() => {
                                        this.errorMsg = "";
                                    }, 10000)
                                    this.alertService.error(error);
                                    this.loading = false;
                                });
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}