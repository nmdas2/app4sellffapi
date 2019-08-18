using Sellff_API.ADO;
using Sellff_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Sellff_API.Services
{
    public class ProfileInfoService
    {
        private readonly ProfileInfoDAO objProfileInfoDAO;

        public ProfileInfoService()
        {
            objProfileInfoDAO = new ProfileInfoDAO();
        }
        public List<ProfileInfoBO> GetUsersInfoBySearchTerm(string searchTerm)
        {
            return objProfileInfoDAO.GetUsersInfoBySearchTerm(searchTerm);
        }
        public List<ProfileInfoBO> SaveUserMessages(ProfileInfoBO objProfileInfoBO)
        {
            return objProfileInfoDAO.SaveUserMessages(objProfileInfoBO);
        }
        public List<ProfileInfoBO> GetAllUserMessages(int UserId)
        {
            return objProfileInfoDAO.GetAllUserMessages(UserId);
        }

        public List<PromotionsBO> GetAllUserPromotions(int UserId)
        {
            return objProfileInfoDAO.GetAllUserPromotions(UserId);
        }
        public List<PostsBO> GetAllUserPosts(int UserId)
        {
            return objProfileInfoDAO.GetAllUserPosts(UserId);
        }

        public List<UserAboutBO> GetUserAboutNGalleryInfo(int UserId, int SectionId)
        {
            return objProfileInfoDAO.GetUserAboutNGalleryInfo(UserId, SectionId);
        }
        public bool SaveUserAboutText(UserAboutBO objUserAboutBO)
        {
            return objProfileInfoDAO.SaveUserAboutText(objUserAboutBO);
        }
        public bool SaveUserGalleryImage(UserAboutBO objUserAboutBO)
        {
            return objProfileInfoDAO.SaveUserGalleryImage(objUserAboutBO);
        }
        public bool SaveUserPostTextMessages(UserPostBO objUserPostBO)
        {
            return objProfileInfoDAO.SaveUserPostTextMessages(objUserPostBO);
        }
        public bool UpdateUsersViewCount(ProfileInfoBO objProfileInfoBO)
        {
            return objProfileInfoDAO.UpdateUsersViewCount(objProfileInfoBO);
        }
        public bool UpdateUsersSocialInfo(ProfileInfoBO objProfileInfoBO)
        {
            return objProfileInfoDAO.UpdateUsersSocialInfo(objProfileInfoBO);
        }
        public bool SaveReviewForUsers(UserReviewBO objUserReviewBO)
        {
            try
            {
                objUserReviewBO.Rating = (objUserReviewBO.Performance + objUserReviewBO.Communication + objUserReviewBO.QOW / 3);
            }
            catch (Exception ex)
            {
                objUserReviewBO.Rating = 0;
            }
            return objProfileInfoDAO.SaveReviewForUsers(objUserReviewBO);
        }
        public List<UserReviewBO> GetAllUserReviewsByUser(UserLocalStorageBO objUserLocalStorageBO)
        {
            return objProfileInfoDAO.GetAllUserReviewsByUser(objUserLocalStorageBO.UserId);
        }
        public bool UpdateUsersReviewAsHelpful(UserReviewBO objUserReviewBO)
        {
            return objProfileInfoDAO.UpdateUsersReviewAsHelpful(objUserReviewBO);
        }

        public UserReviewBO GetCurrentUserRatingById(int currentUserId)
        {
            UserReviewBO objFinalResponse = new UserReviewBO();
            List<UserReviewBO> resultlist = objProfileInfoDAO.GetAllUserReviewsByUser(currentUserId);
            resultlist = (List<UserReviewBO>)resultlist.Where(o => o.RatingGivenTo == currentUserId).ToList();
            if (resultlist.Count > 0)
            {
                objFinalResponse = resultlist[0];
                objFinalResponse.Performance = objFinalResponse.Communication = objFinalResponse.QOW = 0;
                foreach (UserReviewBO item in resultlist)
                {
                    objFinalResponse.Performance += item.Performance;
                    objFinalResponse.Communication += item.Communication;
                    objFinalResponse.QOW += item.QOW;
                    switch (item.Performance)
                    {
                        case 5:
                            objFinalResponse.Starts5 += 1;
                            break;
                        case 4:
                            objFinalResponse.Starts4 += 1;
                            break;
                        case 3:
                            objFinalResponse.Starts3 += 1;
                            break;
                        case 2:
                            objFinalResponse.Starts2 += 1;
                            break;
                        case 1:
                            objFinalResponse.Starts1 += 1;
                            break;
                        default:
                            break;
                    }
                    switch (item.Communication)
                    {
                        case 5:
                            objFinalResponse.Starts5 += 1;
                            break;
                        case 4:
                            objFinalResponse.Starts4 += 1;
                            break;
                        case 3:
                            objFinalResponse.Starts3 += 1;
                            break;
                        case 2:
                            objFinalResponse.Starts2 += 1;
                            break;
                        case 1:
                            objFinalResponse.Starts1 += 1;
                            break;
                        default:
                            break;
                    }
                    switch (item.QOW)
                    {
                        case 5:
                            objFinalResponse.Starts5 += 1;
                            break;
                        case 4:
                            objFinalResponse.Starts4 += 1;
                            break;
                        case 3:
                            objFinalResponse.Starts3 += 1;
                            break;
                        case 2:
                            objFinalResponse.Starts2 += 1;
                            break;
                        case 1:
                            objFinalResponse.Starts1 += 1;
                            break;
                        default:
                            break;
                    }
                }
            }
            return objFinalResponse;
        }

        public ProfileInfoBO GetUserProfileInfoByUserId(int loginUser)
        {
            return objProfileInfoDAO.GetUserProfileInfoByUserId(loginUser);
        }
    }
}