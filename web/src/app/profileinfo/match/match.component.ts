import { Component, OnInit } from '@angular/core';
import { UserServiceTypes } from 'src/app/_models/userservicetypes';
import { ProfileInfo } from 'src/app/_models/profileinfo';
import { Router } from '@angular/router';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/_services/common.service';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  servicesOffered: UserServiceTypes[];
  servicesNeeded: UserServiceTypes[];
  servicesInterested: UserServiceTypes[];
  loggedInUser: ProfileInfo;

  asyncSelectedO: any;
  asyncSelectedN: any;
  asyncSelectedI: any;
  allServicesO: Observable<UserServiceTypes[]>;
  allServicesN: Observable<UserServiceTypes[]>;
  allServicesI: Observable<UserServiceTypes[]>;

  successMsg: string;
  errorMsg: string;
  constructor(
    private router: Router,
    private profileInfoService: ProfileinfoService,
    private commonService: CommonService
  ) {
    this.servicesOffered = [];
    this.servicesNeeded = [];
    this.servicesInterested = [];
  }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
      this.allServicesO = Observable.create((observer: any) => {
        // Runs on every search
        observer.next(this.asyncSelectedO);
      })
        .pipe(
          mergeMap((token: string) => this.getServiceTypes(token))
        );

      this.allServicesN = Observable.create((observer: any) => {
        // Runs on every search
        observer.next(this.asyncSelectedN);
      })
        .pipe(
          mergeMap((token: string) => this.getServiceTypes(token))
        );

      this.allServicesI = Observable.create((observer: any) => {
        // Runs on every search
        observer.next(this.asyncSelectedI);
      })
        .pipe(
          mergeMap((token: string) => this.getServiceTypes(token))
        );

      //this.getServiceTypes();
      this.getServiceTypesByUserId()

    }
    else {
      this.router.navigate(['/']);
    }
  }
  serviceOfferedKeyUp(event, serviceType) {
    if (event.key == 'Enter') {
      this.saveService(event.target.value, serviceType);
    }
  }

  saveService(serviceName, serviceType) {
    let userServiceType = <UserServiceTypes>{};
    userServiceType.ServiceName = serviceName;
    userServiceType.ServiceType = serviceType;
    userServiceType.UserId = this.loggedInUser.UserId;
    userServiceType.UserIP = '127.0.0.1';
    this.commonService.loadingShow();
    this.profileInfoService.SaveUserServiceType(userServiceType)
      .subscribe(res => {
        this.commonService.loadingHide();
        this.asyncSelectedO = '';
        this.asyncSelectedI = '';
        this.asyncSelectedN = '';
        //this.getServiceTypes();
        this.getServiceTypesByUserId();
      }, error => {
        this.commonService.loadingHide();
      })
  }

  getServiceTypes(token) {
    const query = new RegExp(token, 'i');
    return this.profileInfoService.getAllUserServices()
      .pipe(map(res => {
        if (res && res.length > 0) {
          let filteredList = res.filter(ser => {
            return query.test(ser.ServiceName);
          });
          return filteredList
        }
        else {
          return [];
        }

      }))
  }

  getServiceTypesByUserId() {
    //this.clearServices();
    this.profileInfoService.getUserServiceTypesByUserId(this.loggedInUser.UserId)
      .subscribe(res => {
        this.servicesOffered = [];
        this.servicesNeeded = [];
        this.servicesInterested = [];
        if (res && res.length > 0) {
          let userServices = res;
          this.servicesOffered = userServices.filter(service => service.ServiceType == 1);
          this.servicesNeeded = userServices.filter(service => service.ServiceType == 2);
          this.servicesInterested = userServices.filter(service => service.ServiceType == 3);
        }
        if (this.servicesOffered.length < 15) {         
          for (var i = this.servicesOffered.length; i < 15; i++) {
            this.servicesOffered.push({});
          }
        }
        if (this.servicesNeeded.length < 15){
          for (var i = this.servicesNeeded.length; i < 15; i++) {
            this.servicesNeeded.push({});
          }
        }
        // if (this.servicesInterested.length < 15)
        //   this.servicesInterested.unshift({});
      })
  }

  typeaheadOnSelect(event, stype) {
    if (event && event.item) {
      this.saveService(event.item.ServiceName, stype);
    }
  }
  removeServices(service: UserServiceTypes) {
    this.commonService.loadingShow();
    this.profileInfoService.removeUserServiceByType(service)
      .subscribe(res => {
        this.commonService.loadingHide();
        this.getServiceTypesByUserId();
        //this.successMsg = `${service.ServiceName} has been removed success`
      }, error => {
        this.commonService.loadingHide();
      })
  }
}
