using log4net;
using Sellff_API.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace Sellff_API.ADO
{
    public class ProfileInfoDAO
    {
        public static readonly ILog log4netlogger = log4net.LogManager.GetLogger("File");
        public ProfileInfoDAO()
        {

        }
        public List<ProfileInfoBO> GetUsersInfoBySearchTerm(string searchTerm)
        {
            List<ProfileInfoBO> objProfilesList = new List<ProfileInfoBO>();
            SqlParameter[] objSqlParam = new SqlParameter[1];
            try
            {
                objSqlParam[0] = new SqlParameter("@SearchTerm", SqlDbType.VarChar) { Value = searchTerm };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetProfilesBySearchTerm", objSqlParam);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        ProfileInfoBO objProfileInfoBO = new ProfileInfoBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objProfileInfoBO.UserId = Convert.ToInt32(objDataRow["UserId"]);
                        objProfileInfoBO.Email = Convert.ToString(objDataRow["Email"]);
                        objProfileInfoBO.DisplayName = Convert.ToString(objDataRow["DisplayName"]);
                        objProfileInfoBO.ProfilePicPath = Convert.ToString(objDataRow["ProfilePicPath"]);
                        objProfileInfoBO.Rank = Convert.ToInt32(objDataRow["Rank"]);
                        objProfileInfoBO.Occupation = Convert.ToString(objDataRow["Occupation"]);
                        objProfileInfoBO.Reviews = Convert.ToInt32(objDataRow["Reviews"]);
                        objProfilesList.Add(objProfileInfoBO);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objProfilesList;
        }

        public List<ProfileInfoBO> SaveUserMessages(ProfileInfoBO objProfileInfoBO)
        {
            List<ProfileInfoBO> objProfilesList = new List<ProfileInfoBO>();
            try
            {
                var sqlParams = new SqlParameter[4];
                sqlParams[0] = new SqlParameter("@Message", SqlDbType.VarChar) { Value = objProfileInfoBO.Message };
                sqlParams[1] = new SqlParameter("@MessageTo", SqlDbType.VarChar) { Value = objProfileInfoBO.userRefId };
                sqlParams[2] = new SqlParameter("@MessageFrom", SqlDbType.VarChar) { Value = objProfileInfoBO.UserId };
                if (string.IsNullOrEmpty(objProfileInfoBO.UserIP))
                    objProfileInfoBO.UserIP = "::1";
                sqlParams[3] = new SqlParameter("@UserIP", SqlDbType.VarChar) { Value = objProfileInfoBO.UserIP };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "SaveUserMessages", sqlParams);
                //if (_objDataSet.Tables[0].Rows.Count > 0)
                //{
                //    ProfileInfoBO objResponseBO = new ProfileInfoBO();
                //    var objDataRow = _objDataSet.Tables[0].Rows[0];
                //    objResponseBO.Message = Convert.ToString(objDataRow["Message"]);
                //    objResponseBO.DisplayName = Convert.ToString(objDataRow["DisplayName"]);
                //    objResponseBO.MessageSentTime = Convert.ToString(objDataRow["MessageSentTime"]);
                //    objProfilesList.Add(objResponseBO);
                //}
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objProfilesList;
        }
        public List<ProfileInfoBO> GetAllUserMessages(int UserId)
        {
            List<ProfileInfoBO> objProfilesList = new List<ProfileInfoBO>();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "GetUserMessages", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        ProfileInfoBO objResponseBO = new ProfileInfoBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objResponseBO.Message = Convert.ToString(objDataRow["Message"]);
                        objResponseBO.DisplayName = Convert.ToString(objDataRow["DisplayName"]);
                        objResponseBO.MessageSentTime = Convert.ToString(objDataRow["MessageSentTime"]);
                        objResponseBO.MessageTo = Convert.ToInt32(objDataRow["MessageTo"]);
                        objResponseBO.MessageFrom = Convert.ToInt32(objDataRow["MessageFrom"]);
                        objProfilesList.Add(objResponseBO);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objProfilesList;
        }

        public bool RemovePostsByUserIdNPostId(int userId, int postId)
        {
            bool result = true;
            try
            {
                var sqlParams = new SqlParameter[2];
                sqlParams[0] = new SqlParameter("@userId", SqlDbType.Int) { Value = userId };
                sqlParams[1] = new SqlParameter("@postId", SqlDbType.Int) { Value = postId };
                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_RemovePostsByPostId", sqlParams);
            }
            catch (Exception ex)
            {
                result = false;
                log4netlogger.Error(ex);
            }
            return result;
        }

        public bool RemoveAboutImageFromGalleryByUserId(int userId, int galId)
        {
            bool result = true;
            try
            {
                var sqlParams = new SqlParameter[2];
                sqlParams[0] = new SqlParameter("@userId", SqlDbType.Int) { Value = userId };
                sqlParams[1] = new SqlParameter("@galId", SqlDbType.Int) { Value = galId };
                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_RemoveImageFromGallery", sqlParams);
            }
            catch (Exception ex)
            {
                result = false;
                log4netlogger.Error(ex);
            }
            return result;
        }

        public List<PromotionsBO> GetAllUserPromotions(int UserId)
        {
            List<PromotionsBO> objProotionsList = new List<PromotionsBO>();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "GetAllUserPromotions", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        PromotionsBO objResponseBO = new PromotionsBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        var FilterReviewsCount = 0;
                        //if (objDataRow["FilterReviewsCount"] == null)
                        //{
                        //    FilterReviewsCount = 0;
                        //}
                        //else
                        //{
                        //    FilterReviewsCount = Convert.ToInt32(objDataRow["FilterReviewsCount"]);
                        //}
                        objResponseBO.UserId = Convert.ToInt32(objDataRow["UserId"]);
                        objResponseBO.PromotionId = Convert.ToInt32(objDataRow["PromotionId"]);
                        objResponseBO.Image = Convert.ToString(objDataRow["Image"]);
                        objResponseBO.Headline = Convert.ToString(objDataRow["Headline"]);
                        objResponseBO.Attachment = Convert.ToString(objDataRow["Attachment"]);
                        objResponseBO.Detail = Convert.ToString(objDataRow["Detail"]);
                        objResponseBO.Expiration = Convert.ToInt32(objDataRow["Expiration"]);
                        objResponseBO.ExpiryDate = Convert.ToDateTime(objDataRow["ExpiryDate"]);
                        objResponseBO.RewardInShares = objDataRow["RewardInShares"] == null ? 0 : Convert.ToInt32(objDataRow["RewardInShares"]);
                        objResponseBO.RewardInCash = objDataRow["RewardInCash"] == null ? 0 : Convert.ToDecimal(objDataRow["RewardInCash"]);
                        objResponseBO.FilterLocation = Convert.ToString(objDataRow["FilterLocation"]);
                        objResponseBO.FilterReviewsCount = FilterReviewsCount;
                        objResponseBO.FilterPrice = objDataRow["FilterPrice"] == null ? 0 : Convert.ToDecimal(objDataRow["FilterPrice"]);
                        objResponseBO.FilterScore = objDataRow["FilterScore"] == null ? 0 : Convert.ToInt32(objDataRow["FilterScore"]);
                        objResponseBO.FilterServicesNeeded = Convert.ToString(objDataRow["FilterServicesNeeded"]);
                        objResponseBO.CreatedOn = Convert.ToString(objDataRow["CreatedOn"]);
                        objResponseBO.CreatedBy = objDataRow["CreatedBy"] == null ? 0 : Convert.ToInt32(objDataRow["CreatedBy"]);
                        objResponseBO.CreatedIP = Convert.ToString(objDataRow["CreatedIP"]);
                        objProotionsList.Add(objResponseBO);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objProotionsList;
        }

        public bool UpdateUserProfilePicById(int userId, string Profilefilepath, int PicType)
        {
            bool result = true;
            if(PicType == 1)
                Profilefilepath = ConfigurationManager.AppSettings["ProfileimagespathinAngular"].ToString() + Profilefilepath;
            else
                Profilefilepath = ConfigurationManager.AppSettings["bannerimagespathinAngular"].ToString() + Profilefilepath;
            try
            {
                var sqlParams = new SqlParameter[3];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = userId };
                sqlParams[1] = new SqlParameter("@Profilefilepath", SqlDbType.VarChar) { Value = Profilefilepath };
                sqlParams[2] = new SqlParameter("@PicType", SqlDbType.Int) { Value = PicType };
                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_UpdateUserProfilePicPath", sqlParams);
            }
            catch (Exception ex)
            {
                result = false;
                log4netlogger.Error(ex);
            }
            return result;
        }

        public int GetUnReadMessagesCountByUserId(int userId)
        {
            int result = 0;
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = userId };
                result = Convert.ToInt32(SqlHelper.SqlHelper.ExecuteScalar(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetUnReadMessagesCount", sqlParams));                    
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }

        public UserTransactionsBO GetUserProfileChangeValsForPercentageCalc(int userId,decimal currentLastTradePrice)
        {
            UserTransactionsBO objResponseBO = new UserTransactionsBO();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = userId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "GetUserProfileChangeValues", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    var objDataRow = _objDataSet.Tables[0].Rows[0];
                    objResponseBO.UserId = Convert.ToInt32(objDataRow["UserId"]);
                    objResponseBO.DisplayName = Convert.ToString(objDataRow["Displayname"]);
                    objResponseBO.LastTradeSharePrice = Convert.ToDecimal(objDataRow["LastTradePrice"]);
                    objResponseBO.AskPrice = Convert.ToDecimal(objDataRow["AskPrice"]);
                    objResponseBO.BuyPrice = Convert.ToDecimal(objDataRow["BuyPrice"]);
                    objResponseBO.CreatedOn = Convert.ToString(objDataRow["CreatedOn"]);
                    objResponseBO.CreatedTicks = Convert.ToInt64(objDataRow["CreeatedTicks"]);
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objResponseBO;
        }

        public UserTransactionsBO GetUserInvestimentDetailsByUserId(int userId)
        {
            UserTransactionsBO objResponseBO = new UserTransactionsBO();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = userId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "GetUserInvestmentDetails", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    var objDataRow = _objDataSet.Tables[0].Rows[0];
                    objResponseBO.ShareOwnerId = Convert.ToInt32(objDataRow["ShareOwnerId"]);
                    objResponseBO.ShareSymbol = Convert.ToString(objDataRow["ShareSymbol"]);
                    objResponseBO.PurchasedShareQty = Convert.ToInt32(objDataRow["PurchasedShareQty"]);
                    objResponseBO.LastTradeSharePrice = Convert.ToDecimal(objDataRow["LastTradeSharePrice"]);
                    objResponseBO.ChangedPrice = Convert.ToDecimal(objDataRow["ChangedPrice"]);
                    objResponseBO.TotalValueAtPurchasedPrice = Convert.ToDecimal(objDataRow["TotalValueAtPurchasedPrice"]);
                    objResponseBO.TotalMarketValue = Convert.ToDecimal(objDataRow["TotalMarketValue"]);
                    objResponseBO.ErrorMessage = "";
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objResponseBO;
        }

        public UserTransactionsBO GetUserProfileDetailsByUserIdNUserProfileId(int userId, int userProfileId)
        {
            UserTransactionsBO objResponseBO = new UserTransactionsBO();
            try
            {
                var sqlParams = new SqlParameter[2];
                sqlParams[0] = new SqlParameter("@ProfileId", SqlDbType.Int) { Value = userProfileId };
                sqlParams[1] = new SqlParameter("@UserId", SqlDbType.Int) { Value = userId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "GetProfileDetailsByProfileIdAndLoginUserId", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    var objDataRow = _objDataSet.Tables[0].Rows[0];
                    objResponseBO.UserId = Convert.ToInt32(objDataRow["UserId"]);
                    objResponseBO.DisplayName = Convert.ToString(objDataRow["Displayname"]);
                    objResponseBO.Age = Convert.ToInt32(objDataRow["Age"]);
                    objResponseBO.City = Convert.ToString(objDataRow["City"]);
                    objResponseBO.ShareSymbol = Convert.ToString(objDataRow["ShareSymbol"]);
                    objResponseBO.AvailableShareQty = Convert.ToInt32(objDataRow["AvailableShareQty"]);
                    objResponseBO.LastTradeSharePrice = Convert.ToDecimal(objDataRow["LastTradeSharePrice"]);
                    objResponseBO.AskPrice = Convert.ToDecimal(objDataRow["AskPrice"]);
                    objResponseBO.BuyPrice = Convert.ToDecimal(objDataRow["BuyPrice"]);
                    objResponseBO.PurchasedShareQty = Convert.ToInt32(objDataRow["PurchasedShareQty"]);
                    objResponseBO.TotalValueAtCurrentPrice = Convert.ToDecimal(objDataRow["TotalValueAtCurrentPrice"]);
                    objResponseBO.TotalValueAtPurchasedPrice = Convert.ToDecimal(objDataRow["TotalValueAtPurchasedPrice"]);
                    objResponseBO.TotalPurchasedShareQty = Convert.ToInt32(objDataRow["InitialShareQty"]) - Convert.ToInt32(objDataRow["AvailableShareQty"]);
                    objResponseBO.MarketCap = Convert.ToDecimal(objResponseBO.TotalPurchasedShareQty * objResponseBO.LastTradeSharePrice);
                    objResponseBO.ErrorMessage = "";
                }
                if (_objDataSet.Tables[1].Rows.Count > 0)
                {
                    var objDataRow = _objDataSet.Tables[1].Rows[0];
                    objResponseBO.Investors = Convert.ToInt32(objDataRow["Investors"]);
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objResponseBO;
        }

        public bool SaveUserBuySellTransactionDetails(UserTransactionsBO objUserTransactionsBO)
        {
            bool result = true;
            try
            {
                var sqlParams = new SqlParameter[4];
                sqlParams[0] = new SqlParameter("@ProfileId", SqlDbType.Int) { Value = objUserTransactionsBO.UserProfileId };
                sqlParams[1] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objUserTransactionsBO.UserId };
                sqlParams[2] = new SqlParameter("@Qty", SqlDbType.Int) { Value = objUserTransactionsBO.BuySellQty };
                sqlParams[3] = new SqlParameter("@ActionType", SqlDbType.Int) { Value = objUserTransactionsBO.BuySellActionType };
                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "SaveUserTransactionDetails", sqlParams);
            }
            catch (Exception ex)
            {
                result = false;
                log4netlogger.Error(ex);
            }
            return result;
        }

        public bool RemoveUserServiceByType(UserServiceTypesBO objUserServiceTypesBO)
        {
            bool result = true;
            try
            {
                var sqlParams = new SqlParameter[4];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objUserServiceTypesBO.UserId };
                sqlParams[1] = new SqlParameter("@ServiceName", SqlDbType.VarChar) { Value = objUserServiceTypesBO.ServiceName };
                sqlParams[2] = new SqlParameter("@ServiceType", SqlDbType.Int) { Value = objUserServiceTypesBO.ServiceType };
                sqlParams[3] = new SqlParameter("@UserIP", SqlDbType.VarChar) { Value = objUserServiceTypesBO.UserIP };
                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_RemoveUserServiceByType", sqlParams);
            }
            catch (Exception ex)
            {
                result = false;
                log4netlogger.Error(ex);
            }
            return result;
        }

        public List<UserServiceTypesBO> GetUserServiceTypesByUserId(int userId)
        {
            List<UserServiceTypesBO> objResponseList = new List<UserServiceTypesBO>();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = userId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetAllServicesByUserId", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        UserServiceTypesBO objResponseBO = new UserServiceTypesBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objResponseBO.UserId = Convert.ToInt32(objDataRow["UserId"]);
                        objResponseBO.ServiceName = Convert.ToString(objDataRow["ServiceName"]);
                        objResponseBO.ServiceType = Convert.ToInt32(objDataRow["ServiceType"]);
                        objResponseBO.ServiceMatchCount = Convert.ToInt32(objDataRow["NoOfTimesOffered"]);
                        objResponseList.Add(objResponseBO);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objResponseList;
        }

        public List<UserServiceTypesBO> GetAllUserServiceTypes()
        {
            List<UserServiceTypesBO> objResponseList = new List<UserServiceTypesBO>();
            try
            {
                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetAllServicesForAutoSuggestion");
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        UserServiceTypesBO objResponseBO = new UserServiceTypesBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objResponseBO.ServiceName = Convert.ToString(objDataRow["ServiceName"]);
                        objResponseBO.ServiceType = Convert.ToInt32(objDataRow["ServiceType"]);
                        objResponseBO.ServiceMatchCount = Convert.ToInt32(objDataRow["NoOfTimesOffered"]);
                        objResponseList.Add(objResponseBO);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objResponseList;
        }

        public bool SaveUserServiceTypes(UserServiceTypesBO objUserServiceTypesBO)
        {
            bool result = true;
            try
            {
                var sqlParams = new SqlParameter[4];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objUserServiceTypesBO.UserId };
                sqlParams[1] = new SqlParameter("@ServiceName", SqlDbType.VarChar) { Value = objUserServiceTypesBO.ServiceName };
                sqlParams[2] = new SqlParameter("@ServiceType", SqlDbType.Int) { Value = objUserServiceTypesBO.ServiceType };
                sqlParams[3] = new SqlParameter("@UserIP", SqlDbType.VarChar) { Value = objUserServiceTypesBO.UserIP };
                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_SaveServicesInterests", sqlParams);
            }
            catch (Exception ex)
            {
                result = false;
                log4netlogger.Error(ex);
            }
            return result;
        }

        public bool SaveUserBuySellTransactions(UserTransactionsBO objUserTransactionBO)
        {
            bool result = true;
            try
            {
                var sqlParams = new SqlParameter[4];
                sqlParams[0] = new SqlParameter("@ProfileId", SqlDbType.Int) { Value = objUserTransactionBO.UserProfileId };
                sqlParams[1] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objUserTransactionBO.UserId };
                sqlParams[2] = new SqlParameter("@Qty", SqlDbType.Int) { Value = objUserTransactionBO.BuySellQty };
                sqlParams[3] = new SqlParameter("@ActionType", SqlDbType.Int) { Value = objUserTransactionBO.BuySellActionType };
                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "SaveUserTransactionDetails", sqlParams);               
            }
            catch (Exception ex)
            {
                result = false;
                log4netlogger.Error(ex);
            }
            return result;
        }

        public ProfileInfoBO GetUserProfileInfoByUserId(int loginUser)
        {
            ProfileInfoBO objResponseBO = new ProfileInfoBO();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = loginUser };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetUserProfileInfoByUserId", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    var objDataRow = _objDataSet.Tables[0].Rows[0];

                    objResponseBO.UserId = Convert.ToInt32(objDataRow["UserId"]);
                    objResponseBO.Email = Convert.ToString(objDataRow["Email"]);
                    objResponseBO.DisplayName = Convert.ToString(objDataRow["DisplayName"]);
                    objResponseBO.ProfilePicPath = Convert.ToString(objDataRow["ProfilePicPath"]);
                    objResponseBO.UserRefProfileId = 0;
                    objResponseBO.City = Convert.ToString(objDataRow["City"]);
                    objResponseBO.CreatedOn = Convert.ToString(objDataRow["CreatedOn"]);
                    objResponseBO.Views = Convert.ToInt32(objDataRow["Views"]);
                    objResponseBO.Posts = Convert.ToInt32(objDataRow["Posts"]);
                    objResponseBO.Rank = Convert.ToInt32(objDataRow["Rank"]);
                    objResponseBO.ProfileSummary = Convert.ToString(objDataRow["ProfileSummary"]);
                    objResponseBO.FacebookLink = Convert.ToString(objDataRow["FacebookLink"]);
                    objResponseBO.LinkedInLink = Convert.ToString(objDataRow["LinkedInLink"]);
                    objResponseBO.InstagramLink = Convert.ToString(objDataRow["InstagramLink"]);
                    objResponseBO.TwitterLink = Convert.ToString(objDataRow["TwitterLink"]);
                    objResponseBO.YouTubeLink = Convert.ToString(objDataRow["YouTubeLink"]);
                    objResponseBO.WebsiteLink = Convert.ToString(objDataRow["WebsiteLink"]);
                    objResponseBO.GooglePlusLink = Convert.ToString(objDataRow["GooglePlusLink"]);
                    //objResponseBO.SocialEmail = Convert.ToString(objDataRow["SocialEmail"]);
                    objResponseBO.Occupation = Convert.ToString(objDataRow["Occupation"]);
                    objResponseBO.Reviews = Convert.ToInt32(objDataRow["Reviews"]);
                    objResponseBO.Investors = Convert.ToInt32(objDataRow["Investors"]);
                    objResponseBO.Investments = Convert.ToInt32(objDataRow["Investments"]);
                    objResponseBO.ErrorMessage = "";
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objResponseBO;
        }

        public List<PostsBO> GetAllUserPosts(int UserId)
        {
            List<PostsBO> objPostsList = new List<PostsBO>();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "GetUserPostsByUserId", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        PostsBO objResponseBO = new PostsBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objResponseBO.UserId = Convert.ToInt32(objDataRow["UserId"]);
                        objResponseBO.ContentType = Convert.ToInt32(objDataRow["ContentType"]);
                        objResponseBO.Title = Convert.ToString(objDataRow["Title"]);
                        objResponseBO.UserContent = Convert.ToString(objDataRow["UserContent"]);
                        objResponseBO.ImagePath = Convert.ToString(objDataRow["ImagePath"]);
                        objResponseBO.CreatedOn = Convert.ToString(objDataRow["CreatedOn"]);
                        objResponseBO.CreatedBy = Convert.ToInt32(objDataRow["CreatedBy"]);
                        objResponseBO.CreatedIP = Convert.ToString(objDataRow["CreatedIP"]);
                        objPostsList.Add(objResponseBO);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objPostsList;
        }
        public List<UserAboutBO> GetUserAboutNGalleryInfo(int UserId)
        {
            List<UserAboutBO> objAboutList = new List<UserAboutBO>();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetAboutNGalleryInfo", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        UserAboutBO objResponseBO = new UserAboutBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objResponseBO.AutoId = Convert.ToInt32(objDataRow["AutoId"]);
                        objResponseBO.UserId = Convert.ToInt32(objDataRow["UserId"]);
                        objResponseBO.About = Convert.ToString(objDataRow["About"]);
                        objResponseBO.ImagePath = Convert.ToString(objDataRow["ImagePath"]);
                        objResponseBO.CreatedOn = Convert.ToString(objDataRow["CreatedOn"]);
                        objResponseBO.Type = Convert.ToInt32(objDataRow["Type"]);
                        objResponseBO.Views = Convert.ToInt32(objDataRow["Views"]);
                        objResponseBO.ProfilePicPath = Convert.ToString(objDataRow["ProfilePicPath"]);
                        objResponseBO.Posts = Convert.ToInt32(objDataRow["Posts"]);
                        objAboutList.Add(objResponseBO);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objAboutList;
        }

        public bool SaveUserAboutText(UserAboutBO objUserAboutBO)
        {
            var result = false;
            try
            {
                var sqlParams = new SqlParameter[3];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objUserAboutBO.UserId };
                sqlParams[1] = new SqlParameter("@About", SqlDbType.VarChar) { Value = objUserAboutBO.About };
                if (string.IsNullOrEmpty(objUserAboutBO.CreatedIP))
                    objUserAboutBO.CreatedIP = "::1";
                sqlParams[2] = new SqlParameter("@CreatedIP", SqlDbType.VarChar) { Value = objUserAboutBO.CreatedIP };

                if (SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_SaveUserAboutText", sqlParams) > 0)
                    result = true;
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }

        public bool SaveUserGalleryImage(UserAboutBO objUserAboutBO)
        {
            var result = false;
            try
            {
                var sqlParams = new SqlParameter[5];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objUserAboutBO.UserId };
                sqlParams[1] = new SqlParameter("@ImagePath", SqlDbType.VarChar) { Value = objUserAboutBO.ImagePath };
                if (string.IsNullOrEmpty(objUserAboutBO.CreatedIP))
                    objUserAboutBO.CreatedIP = "::1";
                sqlParams[2] = new SqlParameter("@CreatedIP", SqlDbType.VarChar) { Value = objUserAboutBO.CreatedIP };
                sqlParams[3] = new SqlParameter("@Type", SqlDbType.Int) { Value = objUserAboutBO.Type };
                sqlParams[4] = new SqlParameter("@Section", SqlDbType.Int) { Value = objUserAboutBO.Section };

                if (SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_SaveUserImagesDocs", sqlParams) > 0)
                    result = true;
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }
        public bool SaveUserPostTextMessages(UserPostBO objUserPostBO)
        {
            var result = false;
            try
            {
                var sqlParams = new SqlParameter[7];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objUserPostBO.UserId };
                sqlParams[1] = new SqlParameter("@ImagePath", SqlDbType.VarChar) { Value = objUserPostBO.ImagePath };
                if (string.IsNullOrEmpty(objUserPostBO.CreatedIP))
                    objUserPostBO.CreatedIP = "::1";
                sqlParams[2] = new SqlParameter("@CreatedIP", SqlDbType.VarChar) { Value = objUserPostBO.CreatedIP };
                sqlParams[3] = new SqlParameter("@ContentType", SqlDbType.Int) { Value = objUserPostBO.ContentType };
                sqlParams[4] = new SqlParameter("@Title", SqlDbType.VarChar) { Value = objUserPostBO.Title };
                sqlParams[5] = new SqlParameter("@UserContent", SqlDbType.VarChar) { Value = objUserPostBO.UserContent };
                sqlParams[6] = new SqlParameter("@WebURL", SqlDbType.VarChar) { Value = objUserPostBO.WebURL };

                if (SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "SaveUserPosts", sqlParams) > 0)
                    result = true;
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }
        public bool UpdateUsersViewCount(ProfileInfoBO objProfileInfoBO)
        {
            var result = false;
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserRefId", SqlDbType.Int) { Value = objProfileInfoBO.UserId };

                if (SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "UpdateUserViewsCount", sqlParams) > 0)
                    result = true;
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }

        public bool UpdateUsersSocialInfo(ProfileInfoBO objProfileInfoBO)
        {
            var result = false;
            try
            {
                var sqlParams = new SqlParameter[3];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objProfileInfoBO.UserId };
                sqlParams[1] = new SqlParameter("@SocialLinkType", SqlDbType.Int) { Value = objProfileInfoBO.SocialLinkType };
                sqlParams[2] = new SqlParameter("@SocialLink", SqlDbType.VarChar) { Value = objProfileInfoBO.SocialLink };

                if (SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "UpdateUserSocialDetails", sqlParams) > 0)
                    result = true;
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }

        public bool SaveReviewForUsers(UserReviewBO objUserReviewBO)
        {
            var result = false;
            try
            {
                var sqlParams = new SqlParameter[9];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objUserReviewBO.UserId };
                sqlParams[1] = new SqlParameter("@ReviewTitle", SqlDbType.VarChar) { Value = objUserReviewBO.ReviewTitle };
                if (string.IsNullOrEmpty(objUserReviewBO.CreatedIP))
                    objUserReviewBO.CreatedIP = "::1";
                sqlParams[2] = new SqlParameter("@CreatedIP", SqlDbType.VarChar) { Value = objUserReviewBO.CreatedIP };
                sqlParams[3] = new SqlParameter("@ReviewContent", SqlDbType.VarChar) { Value = objUserReviewBO.ReviewContent };
                sqlParams[4] = new SqlParameter("@Rating", SqlDbType.Int) { Value = objUserReviewBO.Rating };
                sqlParams[5] = new SqlParameter("@RatingGivenTo", SqlDbType.Int) { Value = objUserReviewBO.RatingGivenTo };
                sqlParams[6] = new SqlParameter("@Performance", SqlDbType.Int) { Value = objUserReviewBO.Performance };
                sqlParams[7] = new SqlParameter("@Communication", SqlDbType.Int) { Value = objUserReviewBO.Communication };
                sqlParams[8] = new SqlParameter("@QOW", SqlDbType.Int) { Value = objUserReviewBO.QOW };

                if (SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_SaveUserReviews", sqlParams) > 0)
                    result = true;
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }

        public bool UpdateUsersReviewAsHelpful(UserReviewBO objUserReviewBO)
        {
            var result = false;
            try
            {
                var sqlParams = new SqlParameter[3];
                sqlParams[0] = new SqlParameter("@ReviewId", SqlDbType.Int) { Value = objUserReviewBO.ReviewId };
                sqlParams[1] = new SqlParameter("@HelpfullGivenBy", SqlDbType.Int) { Value = objUserReviewBO.UserId };
                if (string.IsNullOrEmpty(objUserReviewBO.CreatedIP))
                    objUserReviewBO.CreatedIP = "::1";
                sqlParams[2] = new SqlParameter("@CreatedIp", SqlDbType.VarChar) { Value = objUserReviewBO.CreatedIP };

                if (SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_UpdateHelpfulInfo", sqlParams) > 0)
                    result = true;
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }
        public List<UserReviewBO> GetAllUserReviewsByUser(int UserId, int loggedInUserId)
        {
            List<UserReviewBO> objResponseList = new List<UserReviewBO>();
            bool reviewAlreadyGiven = false;
            try
            {
                var sqlParams = new SqlParameter[2];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId };
                sqlParams[1] = new SqlParameter("@loggedInUserId", SqlDbType.Int) { Value = loggedInUserId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetAllUserReviewsByUser", sqlParams);
                if (_objDataSet.Tables[1].Rows.Count > 0)
                {
                    if ((Convert.ToInt32(_objDataSet.Tables[1].Rows[0]["AutoId"]) > 0))
                        reviewAlreadyGiven = true;
                }
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        UserReviewBO objResponseBO = new UserReviewBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objResponseBO.ReviewId = Convert.ToInt32(objDataRow["AutoId"]);
                        objResponseBO.ReviewTitle = Convert.ToString(objDataRow["ReviewHeadline"]);
                        objResponseBO.ReviewContent = Convert.ToString(objDataRow["ReviewDetails"]);
                        objResponseBO.CreatedOn = Convert.ToString(objDataRow["ReviewedDate"]);
                        objResponseBO.UserId = Convert.ToInt32(objDataRow["ReviewFromUserId"]);
                        objResponseBO.RatingGivenTo = Convert.ToInt32(objDataRow["ReviewToUserId"]);
                        objResponseBO.Rating = Convert.ToInt32(objDataRow["OverallRating"]);
                        objResponseBO.helpful = Convert.ToInt32(objDataRow["Helpful"]);
                        objResponseBO.ProfilePicPath = Convert.ToString(objDataRow["ProfilePicPath"]);
                        objResponseBO.DisplayName = Convert.ToString(objDataRow["DisplayName"]);
                        objResponseBO.Performance = Convert.ToInt32(objDataRow["Performance"]);
                        objResponseBO.Communication = Convert.ToInt32(objDataRow["Communication"]);
                        objResponseBO.QOW = Convert.ToInt32(objDataRow["QOW"]);
                        objResponseBO.ReviewAlreadyGiven = reviewAlreadyGiven;
                        objResponseList.Add(objResponseBO);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objResponseList;
        }

        public List<PostGroups> GetUserPostsAsGroups(int UserId)
        {
            List<PostGroups> objPostsGroupList = new List<PostGroups>();
            List<PostsBO> objPostsList = new List<PostsBO>();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "GetUserPostsByUserIdByGroup", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        PostsBO objResponseBO = new PostsBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objResponseBO.UserId = Convert.ToInt32(objDataRow["UserId"]);
                        objResponseBO.ContentType = Convert.ToInt32(objDataRow["ContentType"]);
                        objResponseBO.Title = Convert.ToString(objDataRow["Title"]);
                        objResponseBO.UserContent = Convert.ToString(objDataRow["UserContent"]);
                        objResponseBO.ImagePath = Convert.ToString(objDataRow["ImagePath"]);
                        objResponseBO.CreatedOn = Convert.ToString(objDataRow["CreatedOn"]);
                        objResponseBO.CreatedBy = Convert.ToInt32(objDataRow["CreatedBy"]);
                        objResponseBO.CreatedIP = Convert.ToString(objDataRow["CreatedIP"]);
                        objResponseBO.MonthYear = Convert.ToString(objDataRow["MonthYear"]);
                        objResponseBO.WebURL = Convert.ToString(objDataRow["WebURL"]);
                        objPostsList.Add(objResponseBO);
                    }
                }
                if (_objDataSet.Tables[1].Rows.Count > 0)
                {
                    for (int j = 0; j < _objDataSet.Tables[1].Rows.Count; j++)
                    {
                        PostGroups objResponseGroups = new PostGroups();
                        List<PostsBO> objPostsList4Groups = new List<PostsBO>();
                        var objDataRow1 = _objDataSet.Tables[1].Rows[j];
                        objResponseGroups.MonthYear = Convert.ToString(objDataRow1["date"]);
                        objPostsList4Groups = objPostsList.Where(item => item.MonthYear == objResponseGroups.MonthYear).ToList();
                        objResponseGroups.objPostsList = objPostsList4Groups;
                        objPostsGroupList.Add(objResponseGroups);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objPostsGroupList;
        }

        public List<ProfileInfoBO> GetUserMessagesBetween2Users(int userId, int recepId)
        {
            List<ProfileInfoBO> objProfilesList = new List<ProfileInfoBO>();
            try
            {
                var sqlParams = new SqlParameter[2];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = userId };
                sqlParams[1] = new SqlParameter("@RecepId", SqlDbType.Int) { Value = recepId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetUserMessagesBetween2Users", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        ProfileInfoBO objResponseBO = new ProfileInfoBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objResponseBO.Message = Convert.ToString(objDataRow["Message"]);
                        objResponseBO.DisplayName = Convert.ToString(objDataRow["DisplayName"]);
                        objResponseBO.MessageSentTime = Convert.ToString(objDataRow["MessageSentTime"]);
                        objResponseBO.MessageTo = Convert.ToInt32(objDataRow["MessageTo"]);
                        objResponseBO.MessageFrom = Convert.ToInt32(objDataRow["MessageFrom"]);
                        objProfilesList.Add(objResponseBO);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objProfilesList;
        }

        public List<UserShareDetailsBO> FindSharePriceValuesByUserId(int UserId)
        {
            List<UserShareDetailsBO> PriceList = new List<UserShareDetailsBO>();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId };
                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "GetPriceChartValues", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        UserShareDetailsBO objPriceValuesBO = new UserShareDetailsBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        //objPriceValuesBO.DayDate = ToJsonTicks(Convert.ToDateTime(objDataRow["dt"])).ToString();
                        objPriceValuesBO.onlyDate = Convert.ToDateTime(objDataRow["dt"]).Day;
                        objPriceValuesBO.SharePriceValue = Convert.ToDecimal(objDataRow["SharePrice"]);
                        PriceList.Add(objPriceValuesBO);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return PriceList;
        }
        //public string FindSharePriceValuesByUserId1(int UserId)
        //{
        //    string Stockarray = string.Empty;
        //    string dataarray = string.Empty;
        //    try
        //    {
        //        var sqlParams = new SqlParameter[1];
        //        sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId };
        //        DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "GetPriceChartValues", sqlParams);
        //        if (_objDataSet.Tables[0].Rows.Count > 0)
        //        {
        //            for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
        //            {
        //                var objDataRow = _objDataSet.Tables[0].Rows[i];
        //                dataarray += "[" + ToJsonTicks(Convert.ToDateTime(objDataRow["dt"])).ToString();
        //                dataarray += ", " + Convert.ToDecimal(objDataRow["SharePrice"]).ToString() + "],";
        //            }
        //            Stockarray = "[" + dataarray.Remove(dataarray.Length - 1) + "]";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return Stockarray;
        //}

        public long ToJsonTicks(DateTime value)
        {
            return (value.ToUniversalTime().Ticks - ((new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).Ticks)) / 10000;
        }

    }
}