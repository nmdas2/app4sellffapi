import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileInfo } from '../_models/profileinfo';
import { HttpClient } from '@angular/common/http';
import { constants as consts } from '../constants';


@Injectable()
export class CommonService {

    regSuccessMsg = new BehaviorSubject<string>('');
    get regSuccessMsg$(){
        return this.regSuccessMsg.asObservable();
    }

    constructor(private http: HttpClient) {

    }
    userChangeSubject= new Subject<string>();
    isUserChanged(val:any){
        this.userChangeSubject.next(val);
    }
    isProfileSelected = new BehaviorSubject<boolean>(false);
    get isProfileSelected$() {
        return this.isProfileSelected.asObservable();
    }
    isSummaryPage = new BehaviorSubject<boolean>(false);
    get isSummaryPage$() {
        return this.isSummaryPage.asObservable();
    }

    profilePicTracker = new BehaviorSubject<string>('');
    get profilePicTracker$(){
        return this.profilePicTracker.asObservable();
    }

    bannerPicTracker = new BehaviorSubject<string>('');
    get bannerPicTracker$(){
        return this.bannerPicTracker.asObservable();
    }

    socialAndHeaderWidgetsTracker = new BehaviorSubject<boolean>(true)
    get socialAndHeaderWidgetsTracker$() {
        return this.socialAndHeaderWidgetsTracker.asObservable();
    }

    loadingShow() {
        document.getElementById('_loading').style.display = "block";
    }
    loadingHide() {
        document.getElementById('_loading').style.display = "none";
    }
    UpdateUserSocialLinkInfo(data: ProfileInfo): Observable<any> {
        return this.http.post(`${consts.DomainURL}ProfileInfo/UpdateUsersSocialInfo`, data);
    }

    uploadImages(userId: any, type: number, file: any): Observable<any> {
        const formData = new FormData();
        formData.append('files', file);
        return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserProfilePic/${type}/${userId}`, formData,  {
            reportProgress: true,
            observe: 'events'
          })
    }

    GetUnReadMessagesCountByUserId(UserId: number): Observable<any>{
        return this.http.get(`${consts.DomainURL}ProfileInfo/GetUnReadMessagesCountByUserId/${UserId}`);
      }
      
    MessagesReadTracker = new BehaviorSubject<boolean>(true)
    get MessagesReadTracker$() {
        return this.MessagesReadTracker.asObservable();
    }

}