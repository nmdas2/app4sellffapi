import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileInfo } from '../_models/profileinfo';
import { HttpClient } from '@angular/common/http';
import { constants as consts } from '../constants';


@Injectable()
export class CommonService{

    constructor(private http: HttpClient){

    }

    isProfileSelected = new BehaviorSubject<boolean>(false);
    get isProfileSelected$(){
        return this.isProfileSelected.asObservable();
    }
    isSummaryPage = new BehaviorSubject<boolean>(false);
    get isSummaryPage$(){
        return this.isSummaryPage.asObservable();
    }

    loadingShow(){
        document.getElementById('_loading').style.display = "block";
    }
    loadingHide(){
        document.getElementById('_loading').style.display = "none"; 
    }
    UpdateUserSocialLinkInfo(data: ProfileInfo): Observable<any>{
        return this.http.post(`${consts.DomainURL}ProfileInfo/UpdateUsersSocialInfo`, data);
      } 
}