using Sellff_API.ADO;
using Sellff_API.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Sellff_API.Services
{
    public class SellffDefaultService
    {
        SellffDefaultDAO objSellffDefaultDAO;

        public SellffDefaultService()
        {
            objSellffDefaultDAO = new SellffDefaultDAO();
        }
        public ProfileInfoBO AuthenticateSellffUser(string userName, string password)
        {
            return objSellffDefaultDAO.AuthenticateSellffUserInfo(userName, password);
        } 
        public AuthenticationBO RegisterSellffUserInfo(AuthenticationBO objAuthenticationBO)
        {
            AuthenticationBO objResponseBO = objSellffDefaultDAO.RegisterSellffUserInfo(objAuthenticationBO);
            if (objAuthenticationBO.InviteGuid == "")
            {
                EmailTemplatesBO objEmailTemplatesBO = objSellffDefaultDAO.GetEmailTemplate(ConfigurationManager.AppSettings["RegEmail"].ToString());
                try
                {
                    SendEmail(objResponseBO.Email, objResponseBO.DisplayName, objResponseBO.InviteUniqueId, ConfigurationManager.AppSettings["ActivateAppDomain"].ToString(), objEmailTemplatesBO, "");
                }
                catch (Exception ex)
                {
                }
            }
            return objResponseBO;
        }

        public bool SendEmail(string Email, string DisplayName, string InviteUniqueId, string replaceURL, EmailTemplatesBO objEmailTemplatesBO, string RefereUserName)
        {
            String FROM = ConfigurationManager.AppSettings["FROMEmail"].ToString();
            String TO = Email;
            String SUBJECT = objEmailTemplatesBO.EmailSubject;
            string emailBody = objEmailTemplatesBO.EmailTemplate;
            emailBody = emailBody.Replace("[UserName]", DisplayName);
            emailBody = emailBody.Replace("[ActivateURL]", replaceURL + InviteUniqueId);
            if (!string.IsNullOrEmpty(RefereUserName))
                emailBody = emailBody.Replace("[RefereUserName]", RefereUserName);
            objEmailTemplatesBO.SentTo = TO;
            objEmailTemplatesBO.EmailTemplate = emailBody;
            objEmailTemplatesBO.SentFrom = FROM;
            objEmailTemplatesBO.BCC = ConfigurationManager.AppSettings["BCCEmail"].ToString();
            // Supply your SMTP credentials below. Note that your SMTP credentials are different from your AWS credentials.
            String SMTP_USERNAME = ConfigurationManager.AppSettings["SMTPUsername"].ToString();  // Replace with your SMTP username. 
            String SMTP_PASSWORD = ConfigurationManager.AppSettings["SMTPPassword"].ToString();  // Replace with your SMTP password.

            // Amazon SES SMTP host name. This example uses the US West (Oregon) region.
            String HOST = ConfigurationManager.AppSettings["SMTPServer"].ToString();

            // The port you will connect to on the Amazon SES SMTP endpoint. We are choosing port 587 because we will use
            // STARTTLS to encrypt the connection.
            int PORT = Convert.ToInt32(ConfigurationManager.AppSettings["SMTPPort"].ToString());

            // Create an SMTP client with the specified host name and port.
            using (System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient(HOST, PORT))
            {
                // Create a network credential with your SMTP user name and password.
                client.Credentials = new System.Net.NetworkCredential(SMTP_USERNAME, SMTP_PASSWORD);

                // Use SSL when accessing Amazon SES. The SMTP session will begin on an unencrypted connection, and then 
                // the client will issue a STARTTLS command to upgrade to an encrypted connection using SSL.
                client.EnableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["ISSMTPSSL"].ToString());

                System.Net.Mail.MailMessage Message = new System.Net.Mail.MailMessage(FROM, TO);
                Message.Subject = SUBJECT;
                Message.Body = emailBody;
                Message.IsBodyHtml = true;

                System.Net.Mail.MailAddress bcc = new System.Net.Mail.MailAddress(Convert.ToString(ConfigurationManager.AppSettings["BCCEmail"].ToString()));

                Message.Bcc.Add(bcc);

                // Message.CC = Convert.ToString(ConfigurationManager.AppSettings["CCEmail"].ToString());
                // Send the email. 
                try
                {
                    client.Send(Message);
                    objEmailTemplatesBO.IsSent = true;
                }
                catch (Exception ex)
                {
                    objEmailTemplatesBO.IsSent = false;
                    objEmailTemplatesBO.StatusMessage = ex.Message;
                }
                finally
                {
                    objSellffDefaultDAO.SaveEmailLogDetails(objEmailTemplatesBO);
                }
            }
            return true;
        }

        public bool SaveUserInviteDetails(InviteUsersBO objInviteUsersBO)
        {
            return objSellffDefaultDAO.SaveUserInviteDetails(objInviteUsersBO);
        }

        public List<InviteUsersBO> GetInvitedUsersByUserId(int UserId)
        {
            return objSellffDefaultDAO.GetInvitedUsersByUserId(UserId);
        }

        public bool UpdateUserRegisteredByInvitation(string InviteGuid)
        {
            return objSellffDefaultDAO.UpdateUserRegisteredByInvitation(InviteGuid);
        }
        public bool UpdateUserInvitationSentDate(string InviteGuid)
        {
            InviteUsersBO objResponseBO = objSellffDefaultDAO.UpdateUserInvitationSentDate(InviteGuid);
            EmailTemplatesBO objEmailTemplatesBO = objSellffDefaultDAO.GetEmailTemplate(ConfigurationManager.AppSettings["InviteEmail"].ToString());
            try
            {
                SendEmail(objResponseBO.EmailId, objResponseBO.Name, objResponseBO.InviteGuid, ConfigurationManager.AppSettings["InitationURL"].ToString(), objEmailTemplatesBO, objResponseBO.RefereUserName);
            }
            catch (Exception ex)
            {
            }
            return true;
        }

        public InviteUsersBO GetInvitedUsersDetailsByGuidForReg(string inviteGuid)
        {
            return objSellffDefaultDAO.GetInvitedUsersDetailsByGuidForReg(inviteGuid);
        }
        public string CheckIfUserAlreadyInvited(string EmailId, int UserId)
        {
            return objSellffDefaultDAO.CheckIfUserAlreadyInvited(EmailId, UserId);
        }
        public string CheckIfUserAlreadyEsists(string keystring, string displayname)
        {
            return objSellffDefaultDAO.CheckIfUserAlreadyEsists(keystring, displayname);
        }
        public bool ActivateUserAccunt(string keystring)
        {
            return objSellffDefaultDAO.ActivateUserAccunt(keystring);
        }
        public ProfileInfoBO SocialLinksByUserId(int UserId)
        {
            return objSellffDefaultDAO.SocialLinksByUserId(UserId);
        }
        public ProfileInfoBO HeaderWidgetsCountByUserId(int UserId)
        {
            return objSellffDefaultDAO.HeaderWidgetsCountByUserId(UserId);
        }
        public bool Forgotpasswordinfo(string email)
        {
            bool finalresp = true;
            string response = objSellffDefaultDAO.Forgotpasswordinfo(email);
            if (!string.IsNullOrEmpty(response))
            {
                EmailTemplatesBO objEmailTemplatesBO = objSellffDefaultDAO.GetEmailTemplate(ConfigurationManager.AppSettings["ForgotPasswordEmail"].ToString());
                try
                {
                    var resarry = response.Split('~');
                    string emailBody = objEmailTemplatesBO.EmailTemplate;
                    emailBody = emailBody.Replace("[UserName]", resarry[0]);
                    emailBody = emailBody.Replace("[NewPwd]", resarry[1]);
                    SendSMTPEmail(email, objEmailTemplatesBO, emailBody);
                }
                catch (Exception ex)
                {
                    finalresp = false;
                }
            }
            else
                finalresp = false;
            return finalresp;
        }

        public bool Changepasswordinfo(string email, int userId)
        {
            return objSellffDefaultDAO.Changepasswordinfo(email, userId);
        }

        public bool SendSMTPEmail(string Email, EmailTemplatesBO objEmailTemplatesBO, string EmailBody)
        {
            String FROM = ConfigurationManager.AppSettings["FROMEmail"].ToString();
            String SUBJECT = objEmailTemplatesBO.EmailSubject;            
            objEmailTemplatesBO.SentTo = Email;
            objEmailTemplatesBO.EmailTemplate = EmailBody;
            objEmailTemplatesBO.SentFrom = FROM;
            objEmailTemplatesBO.BCC = ConfigurationManager.AppSettings["BCCEmail"].ToString();
            // Supply your SMTP credentials below. Note that your SMTP credentials are different from your AWS credentials.
            String SMTP_USERNAME = ConfigurationManager.AppSettings["SMTPUsername"].ToString();  // Replace with your SMTP username. 
            String SMTP_PASSWORD = ConfigurationManager.AppSettings["SMTPPassword"].ToString();  // Replace with your SMTP password.

            // Amazon SES SMTP host name. This example uses the US West (Oregon) region.
            String HOST = ConfigurationManager.AppSettings["SMTPServer"].ToString();

            // The port you will connect to on the Amazon SES SMTP endpoint. We are choosing port 587 because we will use
            // STARTTLS to encrypt the connection.
            int PORT = Convert.ToInt32(ConfigurationManager.AppSettings["SMTPPort"].ToString());

            // Create an SMTP client with the specified host name and port.
            using (System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient(HOST, PORT))
            {
                // Create a network credential with your SMTP user name and password.
                client.Credentials = new System.Net.NetworkCredential(SMTP_USERNAME, SMTP_PASSWORD);

                // Use SSL when accessing Amazon SES. The SMTP session will begin on an unencrypted connection, and then 
                // the client will issue a STARTTLS command to upgrade to an encrypted connection using SSL.
                client.EnableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["ISSMTPSSL"].ToString());

                System.Net.Mail.MailMessage Message = new System.Net.Mail.MailMessage(FROM, Email);
                Message.Subject = SUBJECT;
                Message.Body = EmailBody;
                Message.IsBodyHtml = true;
                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["BCCEmail"].ToString()))
                {
                    System.Net.Mail.MailAddress bcc = new System.Net.Mail.MailAddress(Convert.ToString(ConfigurationManager.AppSettings["BCCEmail"].ToString()));

                    Message.Bcc.Add(bcc);
                }
                // Message.CC = Convert.ToString(ConfigurationManager.AppSettings["CCEmail"].ToString());
                // Send the email. 
                try
                {
                    client.Send(Message);
                    objEmailTemplatesBO.IsSent = true;
                }
                catch (Exception ex)
                {
                    objEmailTemplatesBO.IsSent = false;
                    objEmailTemplatesBO.StatusMessage = ex.Message;
                }
                finally
                {
                    objSellffDefaultDAO.SaveEmailLogDetails(objEmailTemplatesBO);
                }
            }
            return true;
        }

    }
}