import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { constants as consts } from './../constants';
import { CommonService } from './common.service';
import { ProfileInfo } from '../_models/profileinfo';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    isLogin = new BehaviorSubject<boolean>(false);
    get isLogin$() {
        return this.isLogin.asObservable();
    }
    constructor(private http: HttpClient,
        private commonService: CommonService
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: ProfileInfo) {
        return this.http.post<any>(`${consts.DomainURL}SellffDefault/AuthenticateSellffUserInfo`, user)
            .pipe(map(user => {
                if (user.UserId > 0) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('profilepic', user.ProfilePicPath);
                    localStorage.setItem('bannerpic', user.BannerPicPath);
                    localStorage.removeItem('profileviewUser');
                    this.currentUserSubject.next(user);
                    this.commonService.isProfileSelected.next(false);
                }
                return user;
            }));
    }
    loginForImages(user: ProfileInfo) {
        return this.http.post<any>(`${consts.DomainURL}SellffDefault/AuthenticateSellffUserInfo`, user)
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        localStorage.removeItem('profileviewUser');
        localStorage.removeItem('profilepic');
        localStorage.removeItem('bannerpic');
        this.commonService.isProfileSelected.next(false);
        this.commonService.socialAndHeaderWidgetsTracker.next(false);
        this.isLogin.next(false);
        this.currentUserSubject.next(null);
    }
    socialLinksByUserId(userId: number): Observable<ProfileInfo> {
        return this.http.get<ProfileInfo>(`${consts.DomainURL}SellffDefault/SocialLinksByUserId/${userId}`);
    }
    headerWidgetsCountByUserId(userId: number): Observable<ProfileInfo> {
        return this.http.get<ProfileInfo>(`${consts.DomainURL}SellffDefault/HeaderWidgetsCountByUserId/${userId}`);
    }
    forgotpasswordinfo(email: string): Observable<any> {
        return this.http.get(`${consts.DomainURL}SellffDefault/Forgotpasswordinfo/${email}/1`);
    }
    changepasswordinfo(email: string, UserId: number): Observable<any> {
        return this.http.get(`${consts.DomainURL}SellffDefault/Changepasswordinfo/${email}/${UserId}`);
    }
}