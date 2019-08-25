using log4net;
using Sellff_API.Models;
using System;
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

        public AuthenticationBO RegisterSellffUserInfo(AuthenticationBO objAuthenticationBO)
        {
            try
            {
                objAuthenticationBO.InviteUniqueId = RandomString(Convert.ToInt32(ConfigurationManager.AppSettings["RandomStringLength"]));
                var sqlParams = new SqlParameter[6];                
                sqlParams[0] = new SqlParameter("@Email", SqlDbType.VarChar) { Value = objAuthenticationBO.Email };
                sqlParams[1] = new SqlParameter("@Password", SqlDbType.VarChar) { Value = objAuthenticationBO.Password };
                sqlParams[2] = new SqlParameter("@DisplayName", SqlDbType.VarChar) { Value = objAuthenticationBO.DisplayName };
                sqlParams[3] = new SqlParameter("@Age", SqlDbType.VarChar) { Value = objAuthenticationBO.Age };
                sqlParams[4] = new SqlParameter("@City", SqlDbType.VarChar) { Value = objAuthenticationBO.City };
                sqlParams[5] = new SqlParameter("@InviteUniqueId", SqlDbType.VarChar) { Value = objAuthenticationBO.InviteUniqueId };

                int ResultId = Convert.ToInt32(SqlHelper.SqlHelper.ExecuteScalar(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "SaveUserDetails", sqlParams));
                if (ResultId > 0)
                {
                    objAuthenticationBO.UserId = ResultId;
                }
            }
            catch (Exception ex)
            {
                log4netlogger.Error(ex);
            }
            return objAuthenticationBO;
        }

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}