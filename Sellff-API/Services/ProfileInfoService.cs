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

        public List<UserAboutBO> GetUserAboutNGalleryInfo(int UserId)
        {
            return objProfileInfoDAO.GetUserAboutNGalleryInfo(UserId);
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
                objUserReviewBO.Rating = ((objUserReviewBO.Performance + objUserReviewBO.Communication + objUserReviewBO.QOW) / 3);
            }
            catch (Exception ex)
            {
                objUserReviewBO.Rating = 0;
            }
            return objProfileInfoDAO.SaveReviewForUsers(objUserReviewBO);
        }
        public List<ProfileInfoBO> GetUserMessagesBetween2Users(int userId, int recepId)
        {
            return objProfileInfoDAO.GetUserMessagesBetween2Users(userId, recepId);
        }

        public List<UserReviewBO> GetAllUserReviewsByUser(int Infoval, int loggedInUserId)
        {
            return objProfileInfoDAO.GetAllUserReviewsByUser(Infoval, loggedInUserId);
        }
        public bool UpdateUsersReviewAsHelpful(UserReviewBO objUserReviewBO)
        {
            return objProfileInfoDAO.UpdateUsersReviewAsHelpful(objUserReviewBO);
        }

        public UserReviewBO GetCurrentUserRatingById(int currentUserId)
        {
            UserReviewBO objFinalResponse = new UserReviewBO();
            List<UserReviewBO> resultlist = objProfileInfoDAO.GetAllUserReviewsByUser(currentUserId, 0);
            resultlist = (List<UserReviewBO>)resultlist.Where(o => o.RatingGivenTo == currentUserId).ToList();
            if (resultlist.Count > 0)
            {
                objFinalResponse = resultlist[0];
                int Performance = 0;
                int Communication = 0;
                int QOW = 0;
                foreach (UserReviewBO item in resultlist)
                {
                    Performance += item.Performance;
                    Communication += item.Communication;
                    QOW += item.QOW;
                    switch (item.Rating)
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
                objFinalResponse.Performance = Convert.ToInt32(Performance / resultlist.Count);
                objFinalResponse.Communication = Convert.ToInt32(Communication / resultlist.Count);
                objFinalResponse.QOW = Convert.ToInt32(QOW / resultlist.Count);
            }
            return objFinalResponse;
        }

        public bool RemovePostsByUserIdNPostId(int userId, int postId)
        {
            return objProfileInfoDAO.RemovePostsByUserIdNPostId(userId, postId);
        }

        public bool RemoveAboutImageFromGalleryByUserId(int userId, int galId)
        {
            return objProfileInfoDAO.RemoveAboutImageFromGalleryByUserId(userId, galId);
        }

        public ProfileInfoBO GetUserProfileInfoByUserId(int loginUser)
        {
            return objProfileInfoDAO.GetUserProfileInfoByUserId(loginUser);
        }

        public List<PostGroups> GetUserPostsAsGroups(int UserId)
        {
            return objProfileInfoDAO.GetUserPostsAsGroups(UserId);
        }

        public bool SaveUserBuySellTransactions(UserTransactionsBO objUserTransactionBO)
        {
            return objProfileInfoDAO.SaveUserBuySellTransactions(objUserTransactionBO);
        }

        public bool SaveUserServiceTypes(UserServiceTypesBO objUserServiceTypesBO)
        {
            return objProfileInfoDAO.SaveUserServiceTypes(objUserServiceTypesBO);
        }

        public List<UserServiceTypesBO> GetAllUserServiceTypes()
        {
            return objProfileInfoDAO.GetAllUserServiceTypes();
        }

        public List<UserServiceTypesBO> GetUserServiceTypesByUserId(int userId)
        {
            return objProfileInfoDAO.GetUserServiceTypesByUserId(userId);
        }

        public List<UserServiceTypesBO> GetUserServiceTypesByUserIdNTypeId(int userId, int typeId)
        {
            List<UserServiceTypesBO> resultlist = objProfileInfoDAO.GetUserServiceTypesByUserId(userId);
            return (List<UserServiceTypesBO>)resultlist.Where(o => o.ServiceType == typeId).ToList();
        }

        public bool RemoveUserServiceByType(UserServiceTypesBO objUserServiceTypesBO)
        {
            return objProfileInfoDAO.RemoveUserServiceByType(objUserServiceTypesBO);
        }

        public bool SaveUserBuySellTransactionDetails(UserTransactionsBO objUserTransactionsBO)
        {
            return objProfileInfoDAO.SaveUserBuySellTransactionDetails(objUserTransactionsBO);
        }

        public UserTransactionsBO GetUserProfileDetailsByUserIdNUserProfileId(int userId, int userProfileId)
        {
            return objProfileInfoDAO.GetUserProfileDetailsByUserIdNUserProfileId(userId, userProfileId);
        }

        public UserTransactionsBO GetUserInvestimentDetailsByUserId(int userId)
        {
            UserTransactionsBO objResponseBO = objProfileInfoDAO.GetUserInvestimentDetailsByUserId(userId);
            UserTransactionsBO objPartialResponseBO = GetUserProfileChangeValsForPercentageCalc(userId, objResponseBO.LastTradeSharePrice);
            if (objResponseBO.LastTradeSharePrice > 0)
            {
                decimal previousdayLastTradePrice = objPartialResponseBO.LastTradeSharePrice;
                decimal currentLastTradePrice = Convert.ToDecimal(objResponseBO.LastTradeSharePrice);
                try
                {
                    objResponseBO.PercentageValue = ((currentLastTradePrice - previousdayLastTradePrice) / previousdayLastTradePrice) * 100;
                }
                catch (Exception)
                {
                    objResponseBO.PercentageValue = 0;
                }
                objResponseBO.color = "red";
                if (currentLastTradePrice >= previousdayLastTradePrice)
                    objResponseBO.color = "green";
            }
            return objResponseBO;
        }
        public UserTransactionsBO GetUserProfileChangeValsForPercentageCalc(int userId, decimal currentLastTradePrice)
        {
            return objProfileInfoDAO.GetUserProfileChangeValsForPercentageCalc(userId, currentLastTradePrice);
        }
        public List<UserShareDetailsBO> FindSharePriceValuesByUserId(int UserId)
        {
            return objProfileInfoDAO.FindSharePriceValuesByUserId(UserId);
        }

        public int GetUnReadMessagesCountByUserId(int userId)
        {
            return objProfileInfoDAO.GetUnReadMessagesCountByUserId(userId);
        }

        public bool UpdateUserProfilePicById(int userId, string Profilefilepath, int PicType)
        {
            return objProfileInfoDAO.UpdateUserProfilePicById(userId, Profilefilepath, PicType);
        }
    }
}