import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { Router } from '@angular/router';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { constants as consts } from '../../constants';
import { UserTransaction } from 'src/app/_models/usertransaction';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.scss']
})
export class InvestComponent implements OnInit {

  showBuySell: boolean;
  loggedInUser: ProfileInfo;
  profileInfo: ProfileInfo;
  buyShares: number = consts.BuyShares;
  sellShares: number = consts.SellShares;
  buySharesStr: string;
  sellSharesStr: string;
  userTransactionDetails: UserTransaction;
  successMsg: string = "";
  errorMsg: string = "";
  constructor(
    private profileService: ProfileinfoService,
    private router: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
      if (localStorage.getItem('profileviewUser')) {
        this.profileInfo = JSON.parse(localStorage.getItem('profileviewUser'));
      }

      this.buySharesStr = this.formatNumber(this.buyShares);
      this.sellSharesStr = this.formatNumber(this.sellShares);
      this.getSharesDetails();
      this.getLoggedInUserTranctions();
    }
    else {
      this.router.navigate(['/'])
    }
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  getSharesDetails() {
    let profileId = 0;
    if (this.profileInfo && this.profileInfo.UserId) {
      profileId = this.profileInfo.UserId;
    }
    else {
      profileId = this.loggedInUser.UserId;
    }

    this.profileService.getUserProfileDetailsByUserIdNUserProfileId(this.loggedInUser.UserId, profileId)
      .subscribe(res => {
        this.userTransactionDetails = res
      }, error => {

      })

  }

  getLoggedInUserTranctions() {
    this.profileService.getUserInvestimentDetailsByUserId(this.loggedInUser.UserId)
      .subscribe(res => {
        //console.log(res);
      })
  }

  saveUserBuySellTransactionDetails(type) {
    let obj = <UserTransaction>{}
    obj.UserId = this.loggedInUser.UserId;
    obj.UserProfileId = this.profileInfo && this.profileInfo.UserId ? this.profileInfo.UserId : this.loggedInUser.UserId;
    obj.BuySellActionType = type;
    obj.BuySellQty = type == 2 ? this.buyShares : type == 1 ? this.sellShares : 0;
    this.profileService.saveUserBuySellTransactionDetails(obj)
    .subscribe(res => {
      this.successMsg = 'Transaction details has been submitted successfully';
      setTimeout(() => {
        this.successMsg = ''
      }, 10000)
    }, error =>{
      this.errorMsg = 'Something went wrong';
      setTimeout(() => {
        this.errorMsg = ''
      }, 10000)
    })
  }

}
