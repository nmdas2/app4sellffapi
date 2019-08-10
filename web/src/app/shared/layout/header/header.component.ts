import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  returnUrl: string = "/home";
  loggedInUserInfo: User;
  loggedInUserId: number;
  loggedInUserName: string;
  hasActiveSession: boolean = false;
  searchForm: FormGroup;
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private profileService: ProfileinfoService
    ) { 
      if(localStorage.getItem('currentUser') != null){
        this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.loggedInUserId = this.loggedInUserInfo.UserId;
        this.loggedInUserName = this.loggedInUserInfo.displayName;
        this.hasActiveSession = true;
      }
      else{
        this.router.navigate([this.returnUrl]);
        this.hasActiveSession = false;
      }
    }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      searchprofiles: ['', [Validators.required,Validators.maxLength(25),Validators.pattern('^[a-zA-Z \-\']+')]]
  });
  }

  get f() { return this.searchForm.controls; }

  signoutplz(){
    this.authenticationService.logout();
    this.router.navigate([this.returnUrl]);
  }

  onSubmit() {
    if (this.searchForm.invalid) {
      return;
    }    
    console.log(this.searchForm.value["searchprofiles"]);
    this.router.navigate(['/profileinfo/searchsummary/',{shashval: this.searchForm.value["searchprofiles"]}]);
    // this.profileService.getUsersBySearchTerm(this.searchForm.value)
    // .subscribe(
    //     data => {
    //         //this.alertService.success('Registration successful', true);
    //         this.router.navigate(['/login']);
    //     },
    //     error => {
    //         // this.alertService.error(error);
    //         // this.loading = false;
    //     });
  }

}
