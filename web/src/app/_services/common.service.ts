import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class CommonService{

    isProfileSelected = new BehaviorSubject<boolean>(false);
    get isProfileSelected$(){
        return this.isProfileSelected.asObservable();
    }
    isSummaryPage = new BehaviorSubject<boolean>(false);
    get isSummaryPage$(){
        return this.isSummaryPage.asObservable();
    }
}