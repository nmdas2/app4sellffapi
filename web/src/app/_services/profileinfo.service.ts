import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { constants as consts } from '../constants';
import { ProfileInfo, userAboutInfo } from '../_models/profileinfo';

export interface searchRes {
  displayName: string;
  email: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileinfoService {

  SearchResTracker = new Subject<searchRes[]>();
  searchResults: searchRes[] = [];

  constructor(private http: HttpClient) { }

  // getUsersBySearchTerm(srchTerm: string) {
  //   return this.http.get<searchRes[]>(`${consts.DomainURL}ProfileInfo/GetUsersInfoBySearchTerm/${srchTerm}`);
  // }

  getAllUsersMessages(userId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetAllUserMessages/${userId}`);
  }

  postUserMessage(data: ProfileInfo): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserMessages`, data);
  }

  getUserPosts(userId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetAllUserPosts/${userId}`);
  }

  getAllUserPromotions(userId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetAllUserPromotions/${userId}`);
  }
  
  postUserAboutText(data: userAboutInfo): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserAboutText`, data);
  }

  postUserImagesNDocs(data: userAboutInfo): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserGalleryImagesPath`, data);
  }

  getUsersAboutNGalleryInfo(userId: number,sectionId : number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserAboutNGalleryInfo/${userId}/${sectionId}`);
  }
  
}

