using log4net;
using Sellff_API.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace Sellff_API.ADO
{
    public class SellffDefaultDAO
    {
        public static readonly ILog log4netlogger = log4net.LogManager.GetLogger("File");
        private static Random random = new Random();
        public SellffDefaultDAO()
        {

        }
        public ProfileInfoBO AuthenticateSellffUserInfo(ProfileInfoBO objAuthenticationBO)
        {
            SqlParameter[] objSqlParam = new SqlParameter[2];
            try
            {
                objSqlParam[0] = new SqlParameter("@UserName", SqlDbType.VarChar) { Value = objAuthenticationBO.UserName };
                objSqlParam[1] = new SqlParameter("@Password", SqlDbType.VarChar) { Value = objAuthenticationBO.Password };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_AuthenticateSellffUserInfo", objSqlParam);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    var objDataRow = _objDataSet.Tables[0].Rows[0];
                    objAuthenticationBO.UserId = Convert.ToInt32(objDataRow["UserId"]);
                    objAuthenticationBO.Email = Convert.ToString(objDataRow["Email"]);
                    objAuthenticationBO.DisplayName = Convert.ToString(objDataRow["DisplayName"]);
                    objAuthenticationBO.ProfilePicPath = Convert.ToString(objDataRow["ProfilePicPath"]);
                    objAuthenticationBO.UserRefProfileId = 0;
                    objAuthenticationBO.City = Convert.ToString(objDataRow["City"]);
                    objAuthenticationBO.CreatedOn = Convert.ToString(objDataRow["CreatedOn"]);
                    objAuthenticationBO.Views = Convert.ToInt32(objDataRow["Views"]);
                    objAuthenticationBO.Posts = Convert.ToInt32(objDataRow["Posts"]);
                    objAuthenticationBO.Rank = Convert.ToInt32(objDataRow["Rank"]);
                    objAuthenticationBO.ProfileSummary = Convert.ToString(objDataRow["ProfileSummary"]);
                    objAuthenticationBO.FacebookLink = Convert.ToString(objDataRow["FacebookLink"]);
                    objAuthenticationBO.LinkedInLink = Convert.ToString(objDataRow["LinkedInLink"]);
                    objAuthenticationBO.InstagramLink = Convert.ToString(objDataRow["InstagramLink"]);
                    objAuthenticationBO.TwitterLink = Convert.ToString(objDataRow["TwitterLink"]);
                    objAuthenticationBO.YouTubeLink = Convert.ToString(objDataRow["YouTubeLink"]);
                    objAuthenticationBO.WebsiteLink = Convert.ToString(objDataRow["WebsiteLink"]);
                    objAuthenticationBO.GooglePlusLink = Convert.ToString(objDataRow["GooglePlusLink"]);
                    //objAuthenticationBO.SocialEmail = Convert.ToString(objDataRow["SocialEmail"]);
                    objAuthenticationBO.Occupation = Convert.ToString(objDataRow["Occupation"]);
                    objAuthenticationBO.ErrorMessage = "";
                }
                else
                {
                    objAuthenticationBO.ErrorMessage = "Invalid user name / password";
                }
            }
            catch (Exception ex)
            {
                objAuthenticationBO.ErrorMessage = ex.Message;
                log4netlogger.Error(ex);
            }
            return objAuthenticationBO;
        }

        public EmailTemplatesBO GetEmailTemplate(string emailTemplateId)
        {
            EmailTemplatesBO objEmailTemplatesBO = new EmailTemplatesBO();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@TemplateId", SqlDbType.Int) { Value = emailTemplateId };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetEmailTemplateById", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    var objDataRow = _objDataSet.Tables[0].Rows[0];
                    objEmailTemplatesBO.EmailTemplate = Convert.ToString(objDataRow["EmailTemplate"]);
                    objEmailTemplatesBO.EmailSubject = Convert.ToString(objDataRow["EmailSubject"]);
                    objEmailTemplatesBO.TemplateId = Convert.ToInt32(objDataRow["TemplateId"]);
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objEmailTemplatesBO;
        }

        public AuthenticationBO RegisterSellffUserInfo(AuthenticationBO objAuthenticationBO)
        {
            try
            {
                objAuthenticationBO.InviteUniqueId = RandomString(Convert.ToInt32(ConfigurationManager.AppSettings["RandomStringLength"]));
                var sqlParams = new SqlParameter[7];                
                sqlParams[0] = new SqlParameter("@Email", SqlDbType.VarChar) { Value = objAuthenticationBO.Email };
                sqlParams[1] = new SqlParameter("@Password", SqlDbType.VarChar) { Value = objAuthenticationBO.Password };
                sqlParams[2] = new SqlParameter("@DisplayName", SqlDbType.VarChar) { Value = objAuthenticationBO.DisplayName };
                sqlParams[3] = new SqlParameter("@Age", SqlDbType.VarChar) { Value = objAuthenticationBO.Age };
                sqlParams[4] = new SqlParameter("@City", SqlDbType.VarChar) { Value = objAuthenticationBO.City };
                sqlParams[5] = new SqlParameter("@InviteUniqueId", SqlDbType.VarChar) { Value = objAuthenticationBO.InviteUniqueId };
                sqlParams[6] = new SqlParameter("@InviteGuid", SqlDbType.VarChar) { Value = objAuthenticationBO.InviteGuid };

                string ResultId = Convert.ToString(SqlHelper.SqlHelper.ExecuteScalar(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "SaveUserDetails", sqlParams));
                if (ResultId != "")
                {
                    objAuthenticationBO.InviteUniqueId = ResultId;
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objAuthenticationBO;
        }

        public List<InviteUsersBO> GetInvitedUsersByUserId(int keystring)
        {
            List<InviteUsersBO> objResultList = new List<InviteUsersBO>();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@UserId", SqlDbType.Int) { Value = keystring };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_GetInvitationsSentByUserId", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < _objDataSet.Tables[0].Rows.Count; i++)
                    {
                        InviteUsersBO objResponseBO = new InviteUsersBO();
                        var objDataRow = _objDataSet.Tables[0].Rows[i];
                        objResponseBO.Name = Convert.ToString(objDataRow["Name"]);
                        objResponseBO.EmailId = Convert.ToString(objDataRow["EmailId"]);
                        objResponseBO.Phone = Convert.ToString(objDataRow["Phone"]);
                        objResponseBO.InvitationSentDate = Convert.ToString(objDataRow["InvitationSentDate"]);
                        objResponseBO.IsUserRegistered = Convert.ToBoolean(objDataRow["IsUserRegistered"]);
                        objResponseBO.InvitedBy = Convert.ToInt32(objDataRow["InvitedBy"]);
                        objResponseBO.CreatedOn = Convert.ToString(objDataRow["CreatedOn"]);
                        objResponseBO.InviteGuid = Convert.ToString(objDataRow["InviteGuid"]);
                        objResultList.Add(objResponseBO);
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objResultList;
        }

        public bool SaveUserInviteDetails(InviteUsersBO objInviteUsersBO)
        {
            try
            {
                var sqlParams = new SqlParameter[4];
                sqlParams[0] = new SqlParameter("@Name", SqlDbType.VarChar) { Value = objInviteUsersBO.Name };
                sqlParams[1] = new SqlParameter("@EmailId", SqlDbType.VarChar) { Value = objInviteUsersBO.EmailId };
                sqlParams[2] = new SqlParameter("@Phone", SqlDbType.VarChar) { Value = objInviteUsersBO.Phone };
                sqlParams[3] = new SqlParameter("@UserId", SqlDbType.VarChar) { Value = objInviteUsersBO.UserId };

                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_SaveInvitationDetails", sqlParams);
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return true;
        }

        public bool UpdateUserRegisteredByInvitation(string keystring)
        {
            bool response = true;
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@InviteKey", SqlDbType.VarChar) { Value = keystring };

                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_UpdateRegistrationByInvitation", sqlParams);
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return response;
        }
        public InviteUsersBO UpdateUserInvitationSentDate(string keystring)
        {
            InviteUsersBO objResponseBO = new InviteUsersBO();
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@InviteKey", SqlDbType.VarChar) { Value = keystring };
                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_UpdateInvitationSentDateByInviteGUID", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    var objDataRow = _objDataSet.Tables[0].Rows[0];
                    objResponseBO.Name = Convert.ToString(objDataRow["Name"]);
                    objResponseBO.EmailId = Convert.ToString(objDataRow["EmailId"]);
                    objResponseBO.Phone = Convert.ToString(objDataRow["Phone"]);
                    objResponseBO.InvitationSentDate = Convert.ToString(objDataRow["InvitationSentDate"]);
                    objResponseBO.IsUserRegistered = Convert.ToBoolean(objDataRow["IsUserRegistered"]);
                    objResponseBO.InvitedBy = Convert.ToInt32(objDataRow["InvitedBy"]);
                    objResponseBO.CreatedOn = Convert.ToString(objDataRow["CreatedOn"]);
                    objResponseBO.InviteGuid = Convert.ToString(objDataRow["InviteGuid"]);
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objResponseBO;
        }

        public string CheckIfUserAlreadyInvited(string keystring, int hashky)
        {
            string result = "";
            try
            {
                var sqlParams = new SqlParameter[2];
                sqlParams[0] = new SqlParameter("@EmailId", SqlDbType.VarChar) { Value = keystring };
                sqlParams[1] = new SqlParameter("@UserId", SqlDbType.Int) { Value = hashky };

                DataSet _objDataSet = SqlHelper.SqlHelper.ExecuteDataset(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_CheckIfUserAlreadyInvited", sqlParams);
                if (_objDataSet.Tables[0].Rows.Count > 0)
                {
                    if (Convert.ToInt32(_objDataSet.Tables[0].Rows[0]["RegisteredCount"]) > 0)
                    {
                        result = "This user is already registered.";
                        return result;
                    }
                }
                if (_objDataSet.Tables[1].Rows.Count > 0)
                {
                    if (Convert.ToInt32(_objDataSet.Tables[1].Rows[0]["InvitedCountByMe"]) > 0)
                    {
                        result = "This user is already invited by you.";
                        return result;
                    }
                }
                if (_objDataSet.Tables[2].Rows.Count > 0)
                {
                    if (Convert.ToInt32(_objDataSet.Tables[2].Rows[0]["InvitedCount"]) > 0)
                    {
                        result = "This user is already invited by another user.";
                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }

        public int CheckIfUserAlreadyEsists(string keystring)
        {
            int result = 0;
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@Email", SqlDbType.VarChar) { Value = keystring };

                result = Convert.ToInt32(SqlHelper.SqlHelper.ExecuteScalar(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "CheckIfEmailExists", sqlParams));
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return result;
        }

        public bool ActivateUserAccunt(string keystring)
        {
            try
            {
                var sqlParams = new SqlParameter[1];
                sqlParams[0] = new SqlParameter("@Key", SqlDbType.VarChar) { Value = keystring };

                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_ActivateUserAccount", sqlParams);
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return true;
        }

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public void SaveEmailLogDetails(EmailTemplatesBO objEmailTemplatesBO)
        {
            try
            {
                var sqlParams = new SqlParameter[10];
                sqlParams[0] = new SqlParameter("@TemplateId", SqlDbType.Int) { Value = objEmailTemplatesBO.TemplateId };
                sqlParams[1] = new SqlParameter("@EmailSubject", SqlDbType.VarChar) { Value = objEmailTemplatesBO.EmailSubject };
                sqlParams[2] = new SqlParameter("@EmailTemplate", SqlDbType.VarChar) { Value = objEmailTemplatesBO.EmailTemplate };
                sqlParams[3] = new SqlParameter("@SentFrom", SqlDbType.VarChar) { Value = objEmailTemplatesBO.SentFrom };
                sqlParams[4] = new SqlParameter("@SentTo", SqlDbType.VarChar) { Value = objEmailTemplatesBO.SentTo };
                sqlParams[5] = new SqlParameter("@CC", SqlDbType.VarChar) { Value = objEmailTemplatesBO.CC };
                sqlParams[6] = new SqlParameter("@BCC", SqlDbType.VarChar) { Value = objEmailTemplatesBO.BCC };
                sqlParams[7] = new SqlParameter("@UserId", SqlDbType.Int) { Value = objEmailTemplatesBO.UserId };
                sqlParams[8] = new SqlParameter("@StatusMessage", SqlDbType.VarChar) { Value = objEmailTemplatesBO.StatusMessage };
                sqlParams[9] = new SqlParameter("@IsSent", SqlDbType.Bit) { Value = objEmailTemplatesBO.IsSent };

                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_SaveEmailLog", sqlParams);
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
        }
    }
}