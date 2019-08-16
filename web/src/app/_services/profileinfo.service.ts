import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { constants as consts } from '../constants';
import { ProfileInfo, userAboutInfo } from '../_models/profileinfo';
import { Post } from 'src/app/_models/post';
import { User } from '../_models/user';
import { Review } from '../_models/review';

export interface searchRes {
  DisplayName: string;
  Email: string;
  UserId: number;
  UserRefProfileId: number;
  ProfilePicPath: string;
  ProfileSummary: string;
  FacebookLink: string;
  LinkedInLink: string;
  InstagramLink: string;
  TwitterLink: string;
  YouTubeLink: string;
  Views: number;
  Posts: number;
  City: string;
  Occupation: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileinfoService {

  SearchResTracker = new Subject<searchRes[]>();
  searchResults: searchRes[] = [];

  constructor(private http: HttpClient) { }

  getUsersBySearchTerm(parttext: string) {
    return this.http.get<searchRes[]>(`${consts.DomainURL}ProfileInfo/GetSummaryResults/${parttext}`);
  }

  getAllUsersMessages(userId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetAllUserMessages/${userId}`);
  }

  postUserMessage(data: ProfileInfo): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserMessages`, data);
  }

  getUserPosts(userId: number): Observable<Post[]>{
    return this.http.get<Post[]>(`${consts.DomainURL}ProfileInfo/GetAllUserPosts/${userId}`);
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
  postText(post: Post): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/postText`, post);
  }
  postGallery(post: any): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/postGallery`, post);
  }
  
  UpdateUserViewsCount(data: User): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/UpdateUsersViewCount`, data);
  }
  SaveReview(data: Review): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveReviewForUsers`, data);
  }

}

