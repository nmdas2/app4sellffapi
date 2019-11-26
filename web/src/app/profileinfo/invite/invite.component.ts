import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { Router } from '@angular/router';
import { InviteUsers } from 'src/app/_models/inviteusers';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from 'src/app/_services/common.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  modalRef: BsModalRef;
  inviteForm: FormGroup;
  submitted: boolean = false;
  loggedInUser: ProfileInfo;
  successMsg: string;
  inviteUsersList: InviteUsers[];
  tempInviteUsersList: InviteUsers[];
  maxSize: number = 2;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileinfoService,
    private commonService: CommonService
  ) {
    this.inviteUsersList = [];
    this.tempInviteUsersList = [];
  }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
      this.getInvitedUsersList();
    }
    else {
      this.router.navigate(['/']);
    }
    this.createForm();
  }
  createForm() {
    this.inviteForm = this.fb.group({
      Name: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(14)]]
    })
  }
  popupInviteUser(template) {
    this.modalRef = this.modalService.show(template);
  }

  // extractData(res: Response) {
  //   const body = res.json();
  //   return body.data || {};
  // }

  errorMsg: string
  inviteUser(formData) {
    this.submitted = true;
    if (this.inviteForm.valid) {
      let inviteUserObj = <InviteUsers>{};
      inviteUserObj.UserId = this.loggedInUser.UserId;
      inviteUserObj.Name = formData.Name;
      inviteUserObj.EmailId = formData.Email;
      inviteUserObj.Phone = formData.Phone;
      this.profileService.checkUserAlreadyInvited(formData.Email, this.loggedInUser.UserId)
        .subscribe(res => {
          this.profileService.saveUserInviteDetails(inviteUserObj)
            .subscribe(res => {
              this.successMsg = 'User has been invited successfully';
              this.getInvitedUsersList();
              this.closeModal();
              setTimeout(() => {
                this.successMsg = '';
              }, 10000)

            }, error => {
              console.log(error);
            })
        }, error => {
          if (error.status) {
            this.errorMsg = error.error;
            setTimeout(() => {
              this.errorMsg = ''
            }, 10000);
          }
          else {
            this.errorMsg = 'Something went wrong'
            setTimeout(() => {
              this.errorMsg = ''
            }, 10000);
          }
          console.log(error);
        })

    }
    else {
      this.errorMsg = "Please fill all required fields";
      setTimeout(() => {
        this.errorMsg = ''
      }, 10000);
    }
  }

  closeModal() {
    this.modalRef.hide();
    this.inviteForm.reset();
    this.errorMsg = '';
    this.submitted = false;
  }

  resetForm() {
    this.inviteForm.reset();
    this.errorMsg = '';
    this.submitted = false;
  }
  getInvitedUsersList() {
    this.profileService.getInvitedUsersByUserId(this.loggedInUser.UserId)
      .subscribe(res => {
        if (res && res.length > 0){
          this.inviteUsersList = res;
          this.pageChanged({page: this.currentPage, itemsPerPage: this.itemsPerPage})
        }
          
        else
          this.inviteUsersList = [];
      }, error => {
        console.log(error);
      })
  }

  sortDirection: string = "";
  sortingSearch(field: string) {
    this.sortDirection = this.sortDirection == 'asc' ? 'des' : 'asc';
    if (this.tempInviteUsersList && this.tempInviteUsersList.length > 0) {

      this.tempInviteUsersList = this.tempInviteUsersList.sort((a, b) => {
        if(isNaN(a[field]) && isNaN(b[field])){
          return this.commonService.sortStrings(a[field], b[field], this.sortDirection);
        }
        else{
          return this.commonService.sortNumbers(a[field], b[field], this.sortDirection);
        }
      })
    }
  }

  sendInvitation(inviteUser: InviteUsers) {
    this.profileService.updateUserInvitationSentDate(inviteUser.InviteGuid)
      .subscribe(res => {
        this.successMsg = 'Invitation sent successfully';
        this.getInvitedUsersList();
        setTimeout(() => {
          this.successMsg = '';
        }, 10000)
      }, error => {
        console.log(error);
      })
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
   
  }

  pageChanged(event){
    this.currentPage = event.page - 1
    let itemsPerPage = event.itemsPerPage;
    this.tempInviteUsersList = this.inviteUsersList.slice((this.currentPage ) * itemsPerPage, (this.currentPage + 1) *  itemsPerPage);
  }
  
}


