import { Component, OnInit } from '@angular/core';
import { ProfileinfoService, UserShareDetailsBO } from 'src/app/_services/profileinfo.service';
import { Router } from '@angular/router';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { constants as consts } from '../../constants';
import { UserTransaction } from 'src/app/_models/usertransaction';
import { CommonService } from 'src/app/_services/common.service';
import { StockChart } from 'angular-highcharts';
import { SignalRService } from 'src/app/_services/signal-r.service';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.scss']
})
export class InvestComponent implements OnInit {
  loading: boolean = false;
  showBuySell: boolean; askPrice: number; buyPrice: number; DefaultMsgCss: string = "alert tradestaus";
  loggedInUser: ProfileInfo; profileInfo: ProfileInfo; dataDisplayProfile: ProfileInfo;
  buyShares: number = consts.BuyShares; pricechangeinnegitive: boolean = false;
  sellShares: number = consts.SellShares; profitlossinnegitive: boolean = false;
  buySharesStr: string; sellSharesStr: string; crntshrs: number; defaultMsg: string = "trade status: ready";
  userTransactionDetails: UserTransaction; UserProfileChangeValsForPercentageCalc: UserTransaction;
  successMsg: string = ""; errorMsg: string = ""; stock: StockChart; valnumbers: (Date | number)[][];
  displayMgs: string = "trade status: ready";
  constructor(
    private profileService: ProfileinfoService,
    private router: Router,
    private commonService: CommonService,
    private _signalRService: SignalRService
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

    this.commonService.userInvestments.subscribe((res: any) => {
      let currentUserId = 0, profileViewUserId = 0;
      if (localStorage.getItem('currentUser')) {
        currentUserId = JSON.parse(localStorage.getItem('currentUser')).UserId;
      }
      if (localStorage.getItem('profileviewUser')) {
        profileViewUserId = JSON.parse(localStorage.getItem('profileviewUser')).UserId;
      }
      if (currentUserId == res.UserId || profileViewUserId == res.UserId) {
        this.setLabelData(res);
      }
    }, error => {
      console.log(error);
    });

    this.commonService.userGraphInvestments.subscribe((res: any) => {
      let currentUserId = 0, profileViewUserId = 0;
      if (localStorage.getItem('currentUser')) {
        currentUserId = JSON.parse(localStorage.getItem('currentUser')).UserId;
      }
      if (localStorage.getItem('profileviewUser')) {
        profileViewUserId = JSON.parse(localStorage.getItem('profileviewUser')).UserId;
      }
      if (currentUserId == res.UserId || profileViewUserId == res.UserId) {
        this.setGraphData(res);
      }
    }, error => {
      console.log(error);
    });

  }

  BindDefaultValues() {
    this.getSharesDetails();
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  getSchedularData() {
    this.profileService.getSharePriceValuesByUserId(this.dataDisplayProfile.UserId)
      .subscribe(res => {
        this.setGraphData(res);
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
    // console.log("loggedInUser: "+this.loggedInUser.UserId)
    // console.log("dataDisplayProfile: "+this.dataDisplayProfile.UserId)
    this.profileService.getUserProfileDetailsByUserIdNUserProfileId(this.loggedInUser.UserId, this.dataDisplayProfile.UserId)
      .subscribe(res => {
        this.setLabelData(res);
        //this.crntshrs = this.userTransactionDetails.LastTradeSharePrice;
        //this.getLoggedInUserTranctions();
        this.getSchedularData();
      }, error => {
      })
  }

  setLabelData(res: UserTransaction) {
    this.userTransactionDetails = res
    this.askPrice = this.userTransactionDetails.AskPrice;
    this.buyPrice = this.userTransactionDetails.BuyPrice;
    this.pricechangeinnegitive = this.userTransactionDetails.pricechangeinnegitive;
    this.profitlossinnegitive = this.userTransactionDetails.profitlossinnegitive;
  }

  setGraphData(res: UserShareDetailsBO[]) {
    let graphData = [];
    this.valnumbers = [];
    for (let sc of res) {
      let val: number[] = [];
      val.push(sc.SharePriceValue);
      let dayOfDate: number[] = [];
      dayOfDate.push(sc.onlyDate);
      this.valnumbers.push(dayOfDate, val);
      graphData.push([sc.DayDate, sc.SharePriceValue]);
    };
    this.loading = true;
    //console.log(graphData);
    this.stock = new StockChart({
      rangeSelector: {
        selected: 1
      },
      title: {
        text: ''
      },
      navigator: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        tooltip: {
          valueDecimals: 4
        },
        name: 'share value',
        data: graphData
        ,
        type: undefined
      }]
    });
  }

  getLoggedInUserTranctions() {
    this.profileService.getUserInvestimentDetailsByUserId(this.dataDisplayProfile.UserId, 1)
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
        this._signalRService.SendUserNotificationInfo(this.dataDisplayProfile.UserId);
        this._signalRService.SendUserInvestmentInfo(this.loggedInUser.UserId, this.dataDisplayProfile.UserId);
        this._signalRService.SendUserGraphInvestmentInfo(this.dataDisplayProfile.UserId);
        if (res != "") {
          this.DefaultMsgCss = "alert tradestausfail";
          this.displayMgs = res;
        }
        else {
          this.DefaultMsgCss = "alert tradestaussuccess";
          if (type == 1) {
            this.displayMgs = `trade completed: sell ${this.sellSharesStr} shares at ${this.askPrice}`;
          }
          if (type == 2) {
            this.displayMgs = `trade completed: buy ${this.buySharesStr} shares at ${this.buyPrice}`;
          }
        }
        this.BindDefaultValues();
        this.commonService.socialAndHeaderWidgetsTracker.next(true);
        setTimeout(() => {
          this.displayMgs = this.defaultMsg;
          this.DefaultMsgCss = "alert tradestaus";
        }, 10000)
      }, error => {
        this.errorMsg = 'Something went wrong';
        setTimeout(() => {
          this.displayMgs = this.defaultMsg;
          this.DefaultMsgCss = "alert tradestaus";
        }, 10000)
      })
  }

}
