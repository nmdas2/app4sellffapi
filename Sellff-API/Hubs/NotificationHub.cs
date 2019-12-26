using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Sellff_API.Models;
using Sellff_API.Services;

namespace Sellff_API.Hubs
{
    public class NotificationHub : Hub
    {
        public void GetUserNotification(int UserId)
        {
            SellffDefaultService objSellffDefaultService = new SellffDefaultService();
            var userData = objSellffDefaultService.HeaderWidgetsCountByUserId(UserId);
            Clients.All.SetUserNotification(userData);
        }

        public void GetUserPosts(int UserId)
        {
            ProfileInfoService objProfileInfoService = new ProfileInfoService();
            var userData = objProfileInfoService.GetUserPostsAsGroups(UserId);
            Clients.All.SetUserPosts(userData);
        }

        public void GetUserReview(int Infoval, int loggedInUserId)
        {
            ProfileInfoService objProfileInfoService = new ProfileInfoService();
            var userData = objProfileInfoService.GetAllUserReviewsByUser(Infoval, loggedInUserId);
            Clients.All.SetUserReview(userData);
        }

        public void GetUserReviewRatings(int userId)
        {
            ProfileInfoService objProfileInfoService = new ProfileInfoService();
            var userData = objProfileInfoService.GetCurrentUserRatingById(userId);
            Clients.All.SetUserReviewRatings(userData);
        }

        public void GetUserInvestmentDetails(int userId, int profileId)
        {
            ProfileInfoService objProfileInfoService = new ProfileInfoService();
            var userData = objProfileInfoService.GetUserProfileDetailsByUserIdNUserProfileId(userId, profileId);
            Clients.All.SetUserInvestmentDetails(userData);
        }
        
        public void GetUserGraphDetails(int userId)
        {
            ProfileInfoService objProfileInfoService = new ProfileInfoService();
            var userData = objProfileInfoService.FindSharePriceValuesByUserId(userId);
            Clients.All.SetUserGraphDetails(userData);
        }

        public void GetUserUnReadMessagesCount(int userId)
        {
            ProfileInfoService objProfileInfoService = new ProfileInfoService();
            int userCount = objProfileInfoService.GetUnReadMessagesCountByUserId(userId);
            Clients.All.SetUserUnReadMessagesCount(userId, userCount);
        }

        public void GetUserMessages(bool isEditMode,int displayUserId,int userId)
        {
            ProfileInfoService objProfileInfoService = new ProfileInfoService();
            List<ProfileInfoBO> userMessages = new List<ProfileInfoBO>();
            if (isEditMode)
            {
                userMessages = objProfileInfoService.GetAllUserMessages(userId);
            }
            else
            {
                userMessages = objProfileInfoService.GetUserMessagesGroupBetween2Users(userId, displayUserId);
            }
            
            Clients.All.SetUserMessages(userId,userMessages);
        }
    }
}