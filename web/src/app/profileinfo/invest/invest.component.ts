import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { Router } from '@angular/router';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { constants as consts } from '../../constants';
import { UserTransaction } from 'src/app/_models/usertransaction';
import * as Highcharts from 'highcharts';
import { CommonService } from 'src/app/_services/common.service';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.scss']
})
export class InvestComponent implements OnInit {
//   highcharts = Highcharts;
//   chartOptions = {   
//     chart: { type: "spline" },
//     title: { text: "" },
//     subtitle: { text: "" },
//     xAxis:{categories:[] },
//     yAxis: { title:{ text:"Share Price" } },
//     tooltip: {valueSuffix:""},
//     series: [{name: 'Day',
//           data: []
//        }
//     ]
//  };
loading:boolean= false;
Highcharts = Highcharts;
chartOptions = {
  title: { text: "" },
  xAxis:{categories:[] },
  yAxis: { title:{ text:"share price" } },
  series: [{name: 'day',
    data: []
  }]
};

  showBuySell: boolean; askPrice: number; buyPrice: number;
  loggedInUser: ProfileInfo; profileInfo: ProfileInfo; dataDisplayProfile: ProfileInfo;
  buyShares: number = consts.BuyShares; pricechangeinnegitive: boolean = false;
  sellShares: number = consts.SellShares; profitlossinnegitive: boolean = false;
  buySharesStr: string; sellSharesStr: string; crntshrs: number;
  userTransactionDetails: UserTransaction; UserProfileChangeValsForPercentageCalc: UserTransaction;
  successMsg: string = ""; errorMsg: string = "";
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
    this.profileService.getSharePriceValuesByUserId(this.loggedInUser.UserId)
    .subscribe(res => {
      this.chartOptions.xAxis.categories=[];
     this.chartOptions.series[0].data=[];
      for(let sc of res){
       this.chartOptions.xAxis.categories.push(sc.onlyDate);
       this.chartOptions.series[0].data.push(sc.SharePriceValue);
      };
      this.loading=true;
      //alert(JSON.stringify(this.chartOptions));
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
