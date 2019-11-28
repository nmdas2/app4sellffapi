import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileInfo } from '../_models/profileinfo';
import { HttpClient } from '@angular/common/http';
import { constants as consts } from '../constants';


@Injectable()
export class CommonService {

    regSuccessMsg = new BehaviorSubject<string>('');
    get regSuccessMsg$() {
        return this.regSuccessMsg.asObservable();
    }

    constructor(private http: HttpClient) {

    }
    userChangeSubject = new Subject<string>();
    isUserChanged(val: any) {
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
    get profilePicTracker$() {
        return this.profilePicTracker.asObservable();
    }

    bannerPicTracker = new BehaviorSubject<string>('');
    get bannerPicTracker$() {
        return this.bannerPicTracker.asObservable();
    }

    socialAndHeaderWidgetsTracker = new BehaviorSubject<boolean>(true)
    get socialAndHeaderWidgetsTracker$() {
        return this.socialAndHeaderWidgetsTracker.asObservable();
    }


    userNotifications = new BehaviorSubject<any>('')
    get userNotifications$() {
        return this.userNotifications.asObservable();
    }

    userPosts = new BehaviorSubject<any>('')
    get userPosts$() {
        return this.userPosts.asObservable();
    }

    userReviews = new BehaviorSubject<any>('')
    get userReviews$() {
        return this.userReviews.asObservable();
    }

    profileData = new BehaviorSubject<any>(null);
    get profileData$() {
        return this.profileData.asObservable();
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
        return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserProfilePic/${type}/${userId}`, formData, {
            reportProgress: true,
            observe: 'events'
        })
    }

    GetUnReadMessagesCountByUserId(UserId: number): Observable<any> {
        return this.http.get(`${consts.DomainURL}ProfileInfo/GetUnReadMessagesCountByUserId/${UserId}`);
    }

    MessagesReadTracker = new BehaviorSubject<boolean>(true)
    get MessagesReadTracker$() {
        return this.MessagesReadTracker.asObservable();
    }

    sortStrings(a, b, order) {

        if (order == 'asc') {
            if (a && b) {
                if (a.toString().toLowerCase() > b.toString().toLowerCase())
                    return -1;
                if (b.toString().toLowerCase() > a.toString().toLowerCase())
                    return 1;
                return 0;
            }

        }
        else {
            if (a && b) {
                if (a.toString().toLowerCase() > b.toString().toLowerCase())
                    return 1;
                if (b.toString().toLowerCase() > a.toString().toLowerCase())
                    return -1;
                return 0;
            }
        }

        return 0;
    }
    sortNumbers(a, b, order) {
        if (typeof (a) != undefined && a != null && typeof (b) != undefined && b != null) {
            if (order == 'asc') {
                return (a - b);

            }
            else {
                return (b - a);
            }

        }
        return 0;

    }
    sortBoolean(a, b, order) {
        if (order == 'asc') {
            if (a && b) {
                return a === b ? 0 : a ? -1 : 1;
            }

        }
        else {
            if (a && b) {
                return a === b ? 0 : a ? 1 : -1;
            }
        }

        return 0;
    }

}