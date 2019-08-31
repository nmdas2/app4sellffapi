import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { constants as consts } from '../constants';
import { ProfileInfo, userAboutInfo } from '../_models/profileinfo';
import { Post } from 'src/app/_models/post';
import { Review } from '../_models/review';
import { InviteUsers } from '../_models/inviteusers';
import { UserServiceTypes } from '../_models/userservicetypes';
import { UserTransaction } from '../_models/usertransaction';

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

  GetUserMessagesBetween2Users(userId: number,userRecepId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserMessagesBetween2Users/${userId}/${userRecepId}`);
  }
  postUserMessage(data: ProfileInfo): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserMessages`, data);
  }

  getUserPosts(userId: number): Observable<any>{
    return this.http.get<any>(`${consts.DomainURL}ProfileInfo/GetAllUserPosts/${userId}`);
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

  getUsersAboutNGalleryInfo(userId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserAboutNGalleryInfo/${userId}`);
  }
  postText(post: Post): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserPostTextMessages`, post);
  }
  postGallery(post: any): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/postGallery`, post);
  }  
  UpdateUserViewsCount(data: ProfileInfo): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/UpdateUsersViewCount`, data);
  }
  SaveReview(data: Review): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveReviewForUsers`, data);
  }
  GetUserReviewsById(Infoval: number,loggedInUserId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserReviewsByUser/${Infoval}/${loggedInUserId}`);
  }
  GetCurrentUserRatingById(Infoval: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetCurrentUserRatingById/${Infoval}`);
  }
  GetUserProfileInfoByUserId(loginUser: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserProfileInfoByUserId/${loginUser}`);
  }
  
  getUserPostsByGroups(userId: number): Observable<any>{
    return this.http.get<any>(`${consts.DomainURL}ProfileInfo/GetUserPostsAsGroups/${userId}`);
  }
  checkUserAlreadyInvited(emailId: string, userId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}SellffDefault/CheckIfUserAlreadyInvited/${emailId}/${userId}`)
  }
  saveUserInviteDetails(inviteUser: InviteUsers): Observable<any>{
    return this.http.post(`${consts.DomainURL}SellffDefault/SaveUserInviteDetails`, inviteUser)
  }
  getInvitedUsersByUserId(userId: number): Observable<InviteUsers[]>{
    return this.http.get<InviteUsers[]>(`${consts.DomainURL}SellffDefault/GetInvitedUsersByUserId/${userId}`)
  }
  updateUserInvitationSentDate(inviteGuid: string):Observable<any>{
    return this.http.get(`${consts.DomainURL}SellffDefault/UpdateUserInvitationSentDate/${inviteGuid}`)
  }
  getAllUserServices(): Observable<UserServiceTypes[]>{
    return this.http.get<UserServiceTypes[]>(`${consts.DomainURL}ProfileInfo/GetAllUserServiceTypes`);
  }
  SaveUserServiceType(serviceType: UserServiceTypes): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserServiceTypes`, serviceType);
  }
  getUserServiceTypesByUserId(userId : number): Observable<UserServiceTypes[]>{
    return this.http.get<UserServiceTypes[]>(`${consts.DomainURL}ProfileInfo/GetUserServiceTypesByUserId/${userId}`)
  }

  getUserServiceTypesByUserIdServiceId(userId: number, serviceId: number): Observable<UserServiceTypes[]>{
    return this.http.get<UserServiceTypes[]>(`${consts.DomainURL}ProfileInfo/GetUserServiceTypesByUserIdNTypeId/${userId}/${serviceId}`)
  }
  getUserProfileDetailsByUserIdNUserProfileId(userId: number, profileId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserProfileDetailsByUserIdNUserProfileId/${userId}/${profileId}`)
  }
  getUserInvestimentDetailsByUserId(userId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserInvestimentDetailsByUserId/${userId}`)
  }
  saveUserBuySellTransactionDetails(data: UserTransaction): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserBuySellTransactionDetails`, data)
  }
  
}