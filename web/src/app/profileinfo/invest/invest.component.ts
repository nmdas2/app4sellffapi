import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { Router } from '@angular/router';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { constants as consts } from '../../constants';
import { UserTransaction } from 'src/app/_models/usertransaction';
import { CommonService } from 'src/app/_services/common.service';
import { StockChart } from 'angular-highcharts';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.scss']
})
export class InvestComponent implements OnInit {
loading:boolean= false;
  showBuySell: boolean; askPrice: number; buyPrice: number;
  loggedInUser: ProfileInfo; profileInfo: ProfileInfo; dataDisplayProfile: ProfileInfo;
  buyShares: number = consts.BuyShares; pricechangeinnegitive: boolean = false;
  sellShares: number = consts.SellShares; profitlossinnegitive: boolean = false;
  buySharesStr: string; sellSharesStr: string; crntshrs: number;
  userTransactionDetails: UserTransaction; UserProfileChangeValsForPercentageCalc: UserTransaction;
  successMsg: string = ""; errorMsg: string = ""; stock: StockChart; valnumbers: number[][];
  constructor(
    private profileService: ProfileinfoService,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.dataDisplayProfile = this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
      if (localStorage.getItem('profileviewUser')) {
        this.dataDisplayProfile = this.profileInfo = JSON.parse(localStorage.getItem('profileviewUser'));
      }

      this.buySharesStr = this.formatNumber(this.buyShares);
      this.sellSharesStr = this.formatNumber(this.sellShares);
      this.BindDefaultValues();
    }
    else {
      this.router.navigate(['/'])
    }
  }

  BindDefaultValues()
  {
    this.getSharesDetails();      
  }
  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  getSchedularData(){
    this.profileService.getSharePriceValuesByUserId(this.dataDisplayProfile.UserId)
    .subscribe(res => {
      this.valnumbers = []
      for(let sc of res){
        let val :number[] = [];
        val.push(sc.SharePriceValue);
        this.valnumbers.push(val);
      };
      this.loading=true;
      this.stock = new StockChart({ 
        rangeSelector: {
          selected: 1
        },
        title: {
          text: ''
        },
        series: [{
          tooltip: {
            valueDecimals: 2
          },
          name: 'share value',
          data: this.valnumbers          
          ,
          type: undefined
        }]
        });
    }, error => {

    })
  }
  getSharesDetails() {
    let profileId = 0;
    if (this.profileInfo && this.profileInfo.UserId) {
      profileId = this.profileInfo.UserId;
    }
    else {
      profileId = this.loggedInUser.UserId;
    }
    console.log("loggedInUser: "+this.loggedInUser.UserId)
    console.log("dataDisplayProfile: "+this.dataDisplayProfile.UserId)
    this.profileService.getUserProfileDetailsByUserIdNUserProfileId(this.loggedInUser.UserId, this.dataDisplayProfile.UserId)
      .subscribe(res => {
        this.userTransactionDetails = res
        this.askPrice = this.userTransactionDetails.AskPrice;
        this.buyPrice = this.userTransactionDetails.BuyPrice;
        this.pricechangeinnegitive = this.userTransactionDetails.pricechangeinnegitive;
        this.profitlossinnegitive = this.userTransactionDetails.profitlossinnegitive;
        //this.crntshrs = this.userTransactionDetails.LastTradeSharePrice;
        //this.getLoggedInUserTranctions();
        this.getSchedularData();
      }, error => {
      })
  }

  getLoggedInUserTranctions() {
    this.profileService.getUserInvestimentDetailsByUserId(this.dataDisplayProfile.UserId,1)
      .subscribe(res => {
        this.UserProfileChangeValsForPercentageCalc = res;
        this.userTransactionDetails.PercentageValue = this.UserProfileChangeValsForPercentageCalc.PercentageValue;
        this.userTransactionDetails.pricechange = this.UserProfileChangeValsForPercentageCalc.pricechange
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
      this.BindDefaultValues();
      this.commonService.socialAndHeaderWidgetsTracker.next(true);
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
