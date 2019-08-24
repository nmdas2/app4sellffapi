import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constants as consts } from '../constants';
import { User } from '../_models/user';
import { CommonService } from '../_services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  homesearchForm: FormGroup;
  returnUrl: string = consts.AboutPath;
  loggedInUserInfo: User;
  loggedInUserId: number;
  loggedInUserName: string;
  hasActiveSession: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommonService
    ) {
    if (localStorage.getItem('currentUser') != null) {
      this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      this.loggedInUserId = this.loggedInUserInfo.UserId;
      this.loggedInUserName = this.loggedInUserInfo.DisplayName;
      this.hasActiveSession = true;
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit() {
    this.homesearchForm = this.formBuilder.group({
      homesearchprofiles: ['', [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z \-\']+')]]
    });
    localStorage.removeItem('profileviewUser');
    this.commonService.isProfileSelected.next(false);
  }

  get f() { return this.homesearchForm.controls; }


  onSubmit() {
    if (this.homesearchForm.invalid) {
      return;
    }
    var sparam = this.homesearchForm.value["homesearchprofiles"];
    console.log(sparam);

    this.router.navigate(['/profileinfo/searchsummary/' + sparam]);
  }

}
