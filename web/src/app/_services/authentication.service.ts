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
    get isLogin$(){
        return this.isLogin.asObservable();
    }
    constructor(private http: HttpClient,
            private commonService : CommonService
        ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: ProfileInfo) {
        return this.http.post<any>(`${consts.DomainURL}SellffDefault/AuthenticateSellffUserInfo`,  user )
            .pipe(map(user => {
                if(user.UserId > 0)
                {localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.removeItem('profileviewUser');
                this.currentUserSubject.next(user);
                this.commonService.isProfileSelected.next(false);
            }
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        localStorage.removeItem('profileviewUser');
        this.isLogin.next(false);
        this.currentUserSubject.next(null);
    }
}