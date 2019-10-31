import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constants as consts } from '../constants';
import { User } from '../_models/user';
import { CommonService } from '../_services/common.service';
import { ProfileinfoService, searchRes } from '../_services/profileinfo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  homesearchForm: FormGroup;
  returnUrl: string = consts.AboutPath;
  loggedInUserInfo: User; profileStringSrc: string = "";
  loggedInUserId: number;
  loggedInUserName: string;
  hasActiveSession: boolean = false;
  constructor(
    private pfrlsrvs: ProfileinfoService,
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private route: ActivatedRoute
    ) {    
  }

  ngOnInit() {
    if (localStorage.getItem('currentUser') != null) {
      this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      this.loggedInUserId = this.loggedInUserInfo.UserId;
      this.loggedInUserName = this.loggedInUserInfo.DisplayName;
      this.hasActiveSession = true;
      this.router.navigate(["/"+this.loggedInUserInfo.DisplayName+this.returnUrl]);
    }
    localStorage.removeItem('profileviewUser');
    this.commonService.isProfileSelected.next(false);
    this.commonService.socialAndHeaderWidgetsTracker.next(false);

    this.route.params.subscribe(uparam => {
      if(uparam && uparam.uname){
        this.pfrlsrvs.getUserProfileByURLString(uparam.uname)
        .subscribe(res => {
          if(res.UserId>0)
          {
            localStorage.setItem('profileviewUser', JSON.stringify(res));
            console.log(JSON.stringify(res));
            this.commonService.isUserChanged('yes');
            this.router.navigate(["/"+res.DisplayName + consts.AboutPath]);
            this.commonService.isProfileSelected.next(true);
          }
        });
      }
    })
    this.homesearchForm = this.formBuilder.group({
      homesearchprofiles: ['', [Validators.required, Validators.maxLength(25)]]
    });    
  }

  get f() { return this.homesearchForm.controls; }


  onSubmit() {
    if (this.homesearchForm.invalid) {
      return;
    }
    var sparam = this.homesearchForm.value["homesearchprofiles"];
    this.router.navigate(['/profileinfo/searchsummary'], { queryParams: { searchTerm: sparam } });
  }

}
