import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { constants as consts, constants } from '../constants';
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
export interface UserShareDetailsBO{
  DayDate?: Date;
  SharePriceValue? : number;
  onlyDate?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileinfoService {

  SearchResTracker = new Subject<searchRes[]>();
  searchResults: searchRes[] = [];

  constructor(private http: HttpClient) { }

  getUsersBySearchTerm(parttext: string) {
    var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.get<searchRes[]>(`${consts.DomainURL}ProfileInfo/GetSummaryResults?parttext=${parttext}`, { headers: reqHeader });
  }

  getAdvancedSearchBySearchTerm(type:number,parttext: string) {
    return this.http.get<searchRes[]>(`${consts.DomainURL}ProfileInfo/GetAdvancedSearchResults?partype=${type}&parttext=${parttext}`);
  }

  getUserProfileByURLString(UrlString: string) {
    var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.get<searchRes>(`${consts.DomainURL}ProfileInfo/getUserProfileByURLString/${UrlString}`, { headers: reqHeader });
  }

  getAllUsersMessages(userId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetAllUserMessages/${userId}`);
  }

  GetUserMessagesBetween2Users(userId: number,userRecepId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserMessagesBetween2Users/${userId}/${userRecepId}`);
  }
  GetUserMessagesGroupBetween2Users(userId: number,userRecepId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserMessagesGroupBetween2Users/${userId}/${userRecepId}`);
  }
  GetHistoryUserId(messageToId: number,messageFromId: number,readNotReq: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserMessagesHistory/${messageToId}/${messageFromId}/${readNotReq}`);
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
  updateusercityvalue(data: userAboutInfo): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/updateusercityvalue`, data);
  }
  updateuseroccupationvalue(data: userAboutInfo): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/updateuseroccupationvalue`, data);
  }
  postUserImagesNDocs(data: userAboutInfo): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserGalleryImagesPath`, data);
  }

  getUsersAboutNGalleryInfo(userId: number): Observable<any>{
    var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserAboutNGalleryInfo/${userId}`, { headers: reqHeader });
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
    var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserProfileInfoByUserId/${loginUser}`, { headers: reqHeader });
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
    var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.get<UserServiceTypes[]>(`${consts.DomainURL}ProfileInfo/GetUserServiceTypesByUserIdNTypeId/${userId}/${serviceId}`, { headers: reqHeader })
  }
  getUserProfileDetailsByUserIdNUserProfileId(userId: number, profileId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserProfileDetailsByUserIdNUserProfileId/${userId}/${profileId}`)
  }
  getUserInvestimentDetailsByUserId(userId: number, cuprice: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUserInvestimentDetailsByUserId/${userId}/${cuprice}`)
  }
  saveUserBuySellTransactionDetails(data: UserTransaction): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/SaveUserBuySellTransactionDetails`, data)
  }
  removeUserServiceByType(service: UserServiceTypes): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/RemoveUserServiceByType`, service)
  }
  updateHelpfulCount(data: Review): Observable<any>{
    return this.http.post(`${consts.DomainURL}ProfileInfo/UpdateUsersReviewAsHelpful`, data)
  }
  getSharePriceValuesByUserId(userId: number): Observable<UserShareDetailsBO[]>{
    return this.http.get<UserShareDetailsBO[]>(`${consts.DomainURL}ProfileInfo/FindSharePriceValuesByUserId/${userId}`)
  }
  GetUnReadMessagesCountByUserId(UserId: number): Observable<any>{
    return this.http.get(`${consts.DomainURL}ProfileInfo/GetUnReadMessagesCountByUserId/${UserId}`);
  }
  saveImageGallery(fileData): Observable<any>{
    const formData = new FormData();
    formData.append('files', fileData);
    return this.http.post(`${constants.DomainURL}ProfileInfo/SaveImagesForGallery`, formData)
  }
  saveImageGalleryForPost(formData): Observable<any>{    
    return this.http.post(`${constants.DomainURL}ProfileInfo/SaveImagesForPost`, formData)
  }
  removePostByAutoid(UserId:number, postId: number): Observable<any>{
    return this.http.get<any>(`${consts.DomainURL}ProfileInfo/RemovePostsByUserIdNPostId/${UserId}/${postId}`);
  }
  removeGalleryPicByAutoid(UserId:number, GalId: number): Observable<any>{
    return this.http.get<any>(`${consts.DomainURL}ProfileInfo/RemoveAboutImageFromGalleryByUserId/${UserId}/${GalId}`);
  }
}