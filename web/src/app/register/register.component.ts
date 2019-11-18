import { Component, OnInit, TemplateRef,ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, max } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { UserService } from '../_services/user.service';
import { CommonService } from '../_services/common.service';
import { User } from '../_models/user';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
    inviteGuid: string;
    captchaSuccess: boolean = false;
    modalRef: BsModalRef;
    @ViewChild('UserName',{static: false}) inputEl:ElementRef;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private commonService: CommonService,
        private route: ActivatedRoute,
        private modalService: BsModalService
    ) {
        //redirect to home if already logged in
        this.route.queryParams.subscribe(params => {
            if (params && params.InviteGuid) {
                this.authenticationService.logout();
                this.inviteGuid = params.InviteGuid;
            }
            else {
                this.inviteGuid  = "";
                if (this.authenticationService.currentUserValue) {
                    this.router.navigate(['/profileinfo/about']);
                }
                else{
                    this.authenticationService.logout();
                }
            }
        })

    }
  
    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            displayName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25), Validators.pattern("^[A-Za-z0-9]*$")]],
            email: ['', [Validators.required, Validators.maxLength(50)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            // age: ['', [Validators.required, Validators.min(1), Validators.max(130)]],
            termsandconditions: ['', [Validators.required]],
            city: ['', [Validators.required]],
            recaptchaReactive: [null, Validators.required]
        });
    }

    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) { return; }
        this.userService.CheckIfUserExists(this.registerForm.value.email,this.registerForm.value.displayName)
            .subscribe(
                data => {
                    console.log('reg chk'+data);
                    if (data != "") {                        
                        this.errorMsg = data;
                        setTimeout(() => {
                            this.errorMsg = "";
                        }, 30000)
                        //this.alertService.success('This user already registered with Sellff.', true);
                        return;
                    }
                    else {
                        this.loading = true;
                        this.commonService.loadingShow();
                        let userInfo = <User>{};
                        userInfo.DisplayName = this.registerForm.value.displayName;
                        userInfo.email = this.registerForm.value.email;
                        userInfo.password = this.registerForm.value.password;
                        userInfo.Age = 0; //this.registerForm.value.age;
                        userInfo.City = this.registerForm.value.city;
                        userInfo.InviteGuid = this.inviteGuid;
                        this.userService.register(userInfo)
                            .pipe(first())
                            .subscribe(
                                data => {
                                    this.commonService.loadingHide();
                                    // this.successMsg = 'Registration successful';
                                    // setTimeout(() => {
                                    //     this.successMsg = "";
                                    // }, 10000)
                                    //this.alertService.success('Registration successful', true, 10000);
                                    this.router.navigate(['/login']);
                                    this.commonService.regSuccessMsg.next('registration was successful, we have sent an verification email to you.');
                                },
                                error => {
                                    this.commonService.loadingHide();
                                    this.errorMsg = 'Something went wrong. Please try after some time';
                                    setTimeout(() => {
                                        this.errorMsg = "";
                                    }, 30000)
                                    //this.alertService.error(error);
                                    this.loading = false;
                                });
                    }
                },
                error => {
                    //this.alertService.error(error);
                    this.errorMsg = 'Something went wrong. Please try after some time';
                    setTimeout(() => {
                        this.errorMsg = "";
                    }, 30000)
                    this.loading = false;
                });
    }

    ngAfterViewInit(){
        if(this.inviteGuid){
           // http://localhost:4200/register?InviteGuid=782A0DCD-5456-44F6-90EE-1A6EFC00F834
            this.getInvitedUserInfo();
        }
        setTimeout(() => this.inputEl.nativeElement.focus());
    }

    getInvitedUserInfo(){
        this.userService.getInvitedUserByGuid(this.inviteGuid)
        .subscribe(res => {
            if(res && res.Name && res.EmailId){
                this.registerForm.get('displayName').setValue(res.Name);
                this.registerForm.get('email').setValue(res.EmailId);
            }
        })
    }
    resolved(captchaResponse: string) {
        this.captchaSuccess = true;
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
      }
}