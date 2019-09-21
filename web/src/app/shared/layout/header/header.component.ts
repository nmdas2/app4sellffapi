import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { CommonService } from 'src/app/_services/common.service';
import { Subscription } from 'rxjs';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  returnUrl: string = "/home"; loggedInUserInfo: ProfileInfo; hasActiveSession: boolean = false;
  searchForm: FormGroup; readonlyUserInfo: ProfileInfo; profileSubscription: Subscription;
  submitted = false; modalRef: BsModalRef; showheadsection: boolean = false; previewUrl: any = null;
  dataDisplayProfile: ProfileInfo; toggler: boolean = false; unReadMsgsCount: number = 0;
  fileUploadProgress: string = null; uploadedFilePath: string = null; fileData: File = null; 
  postGalleryForm: FormGroup; AllowImageUpload: boolean = false;
  @Output() closeSideNav = new EventEmitter<boolean>();
  isSummarySub: Subscription;
  isSummaryPage: boolean;
  isLogin: boolean;

  loginSub : Subscription;
  constructor(
    private router: Router,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private profileInfoService: ProfileinfoService,
    private modalService: BsModalService,
    private commonService: CommonService,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    
    this.isSummarySub = this.commonService.isSummaryPage$.subscribe(status => {
      setTimeout(() => {
        this.isSummaryPage = status;
      }, 3)

    });

    this.loginSub = this.authenticationService.isLogin$.subscribe(status => {
      this.isLogin = status;
      if (this.isLogin) {
        // document.getElementById("mySidenav").style.width = "228px";
        // document.getElementById("main").style.marginLeft = "228px";
      }
      else {
        // document.getElementById("mySidenav").style.width = "0";
        // document.getElementById("main").style.marginLeft = "0";
      }
    });

    this.profileSubscription = this.commonService.isProfileSelected$.subscribe(status => {
      this.hasActiveSession = false;
      this.showheadsection = false;
      this.loggedInUserInfo = <ProfileInfo>{};
      
      if (localStorage.getItem('currentUser')) {
        this.dataDisplayProfile = this.loggedInUserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.showheadsection = true;
        this.hasActiveSession = true;
      }
      if (!status) {
        if (localStorage.getItem('currentUser')) {
          // this.loggedInUserId = this.loggedInUserInfo.UserId;
          // this.loggedInUserName = this.loggedInUserInfo.DisplayName;
          // this.loggedInUserRank = this.loggedInUserInfo.Rank;
          // this.LoggedInUserProfilePic = this.loggedInUserInfo.ProfilePicPath;
          this.hasActiveSession = true;
        }
      }
      else {
        if (localStorage.getItem('profileviewUser')) {
          this.dataDisplayProfile = this.readonlyUserInfo = JSON.parse(localStorage.getItem('profileviewUser'));
          this.showheadsection = true;
        }
      }

    });
    if(this.dataDisplayProfile && this.dataDisplayProfile.UserId)
      this.GetUnReadMessagesCount(this.dataDisplayProfile.UserId);
    this.searchForm = this.formBuilder.group({
      searchprofiles: ['', [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z \-\']+')]]
    });
    
    this.postGalleryForm = this.fb.group({
      image: ['', []]
    });
  }
  GetUnReadMessagesCount(userId: number)
  {
    this.profileInfoService.GetUnReadMessagesCountByUserId(userId)
      .subscribe(data => {
        console.log(data);
          if(data>0)
            this.unReadMsgsCount = data;
        },
        error => {
        });
  } 

  get f() { return this.searchForm.controls; }

  signoutplz() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('profileviewUser');
    this.authenticationService.logout();
    this.hasActiveSession = false;
    this.router.navigate([this.returnUrl]);
  }

  onSubmit() {
    if (this.searchForm.invalid) {
      return;
    }
    var sparam = this.searchForm.value["searchprofiles"];
    this.router.navigate(['/profileinfo/searchsummary/'], { queryParams: {searchTerm : sparam}});
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

  taketoActualProfile() {
    localStorage.removeItem('profileviewUser');
    this.loggedInUserInfo.userRefId = 0;
    this.commonService.isProfileSelected.next(false);
    this.commonService.socialAndHeaderWidgetsTracker.next(true);
    this.router.navigate(['/home']);
  }
  ngOnDestroy() {
    if (this.profileSubscription)
      this.profileSubscription.unsubscribe();

    if(this.loginSub){
      this.loginSub.unsubscribe();
    }
  }

  gotoregister() {
    this.router.navigate(['/register']);
  }

  gotologin() {
    this.router.navigate(['/login']);
  }

  homePageRedirection(){
    this.router.navigate(['/']);
  }

  toggleSideNav(){
    this.toggler = !this.toggler;
    this.closeSideNav.emit(this.toggler);
  }

  navigateTo(url){
    this.router.navigate([url]);
  }
  uploadprofilepic(Profilepictemplate) {
    this.modalRef = this.modalService.show(Profilepictemplate);
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  saveGalleryPost(postData) {
    this.fileUploadProgress = '0%';
    this.commonService.uploadImages(this.loggedInUserInfo.UserId, 1, this.fileData)
      .subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {
          this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
        } else if (events.type === HttpEventType.Response) {
          this.fileUploadProgress = '';
        }
      })
  }

}
