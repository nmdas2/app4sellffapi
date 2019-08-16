﻿using log4net;
using Sellff_API.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

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
                        objProfileInfoBO.City = Convert.ToString(objDataRow["City"]);
                        objProfileInfoBO.Occupation = Convert.ToString(objDataRow["Occupation"]);
                        objProfileInfoBO.UserRefProfileId = 0;// Convert.ToInt32(objDataRow["UserId"]);
                        objProfileInfoBO.Views = Convert.ToInt32(objDataRow["Views"]);
                        objProfileInfoBO.Posts = Convert.ToInt32(objDataRow["Posts"]);
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
        public List<UserAboutBO> GetUserAboutNGalleryInfo(int UserId, int SectionId)
        {
            List<UserAboutBO> objAboutList = new List<UserAboutBO>();
            try
            {
                var sqlParams = new SqlParameter[2];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId };
                sqlParams[1] = new SqlParameter("@SectionId", SqlDbType.Int) { Value = SectionId };

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
                var sqlParams = new SqlParameter[6];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objUserPostBO.UserId };
                sqlParams[1] = new SqlParameter("@ImagePath", SqlDbType.VarChar) { Value = objUserPostBO.ImagePath };
                if (string.IsNullOrEmpty(objUserPostBO.CreatedIP))
                    objUserPostBO.CreatedIP = "::1";
                sqlParams[2] = new SqlParameter("@CreatedIP", SqlDbType.VarChar) { Value = objUserPostBO.CreatedIP };
                sqlParams[3] = new SqlParameter("@ContentType", SqlDbType.Int) { Value = objUserPostBO.ContentType };
                sqlParams[4] = new SqlParameter("@Title", SqlDbType.VarChar) { Value = objUserPostBO.Title };
                sqlParams[5] = new SqlParameter("@UserContent", SqlDbType.VarChar) { Value = objUserPostBO.Content };

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
                sqlParams[0] = new SqlParameter("@UserRefId", SqlDbType.Int) { Value = objProfileInfoBO.UserRefProfileId };

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
                sqlParams[2] = new SqlParameter("@SocialLink", SqlDbType.Int) { Value = objProfileInfoBO.SocialLink };

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
                var sqlParams = new SqlParameter[6];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objUserReviewBO.UserId };
                sqlParams[1] = new SqlParameter("@ReviewTitle", SqlDbType.VarChar) { Value = objUserReviewBO.ReviewTitle };
                if (string.IsNullOrEmpty(objUserReviewBO.CreatedIP))
                    objUserReviewBO.CreatedIP = "::1";
                sqlParams[2] = new SqlParameter("@CreatedIP", SqlDbType.VarChar) { Value = objUserReviewBO.CreatedIP };
                sqlParams[3] = new SqlParameter("@ReviewContent", SqlDbType.VarChar) { Value = objUserReviewBO.ReviewContent };
                sqlParams[4] = new SqlParameter("@Rating", SqlDbType.Int) { Value = objUserReviewBO.Rating };
                sqlParams[5] = new SqlParameter("@RatingGivenTo", SqlDbType.Int) { Value = objUserReviewBO.RatingGivenTo };

                if (SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "SaveUserReviews", sqlParams) > 0)
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
                var sqlParams = new SqlParameter[2];
                sqlParams[0] = new SqlParameter("@ReviewId", SqlDbType.Int) { Value = objUserReviewBO.ReviewId };
                sqlParams[1] = new SqlParameter("@HelpfullGivenBy", SqlDbType.Int) { Value = objUserReviewBO.UserId };

                if (SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "UpdateUsersReviewAsHelpful", sqlParams) > 0)
                    result = true;
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }
        public List<UserReviewBO> GetAllUserReviewsByUser(int UserId)
        {
            List<UserReviewBO> objResponseList = new List<UserReviewBO>();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetAllUserReviewsByUser", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        UserReviewBO objResponseBO = new UserReviewBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objResponseBO.ReviewId = Convert.ToInt32(objDataRow["ReviewId"]);
                        objResponseBO.ReviewTitle = Convert.ToString(objDataRow["ReviewTitle"]);
                        objResponseBO.ReviewContent = Convert.ToString(objDataRow["ReviewContent"]);
                        objResponseBO.CreatedOn = Convert.ToString(objDataRow["CreatedOn"]);
                        objResponseBO.CreatedBy = Convert.ToInt32(objDataRow["CreatedBy"]);
                        objResponseBO.Rating = Convert.ToInt32(objDataRow["Rating"]);
                        objResponseBO.helpful = Convert.ToInt32(objDataRow["helpful"]);
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


    }
}