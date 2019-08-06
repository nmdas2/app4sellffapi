using log4net;
using Sellff_API.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sellff_API.ADO
{
    public class SellffDefaultDAO
    {
        public static readonly ILog log4netlogger = log4net.LogManager.GetLogger("File");
        public SellffDefaultDAO()
        {

        }
        public AuthenticationBO AuthenticateSellffUserInfo(AuthenticationBO objAuthenticationBO)
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
                byte[] theBytes = Encoding.UTF8.GetBytes(objAuthenticationBO.Password);
                var sqlParams = new SqlParameter[3];
                sqlParams[0] = new SqlParameter("@DisplayName", SqlDbType.VarChar) { Value = objAuthenticationBO.DisplayName };
                sqlParams[1] = new SqlParameter("@Email", SqlDbType.VarChar) { Value = objAuthenticationBO.Email };
                sqlParams[2] = new SqlParameter("@Password", SqlDbType.VarBinary) { Value = theBytes };


                int ResultId = Convert.ToInt32(SqlHelper.SqlHelper.ExecuteScalar(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Proc_RegisterSellffUserInfo", sqlParams));
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
    }
}