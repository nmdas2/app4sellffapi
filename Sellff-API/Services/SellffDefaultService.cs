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
        public ProfileInfoBO AuthenticateSellffUser(ProfileInfoBO objAuthenticationBO)
        {
            return objSellffDefaultDAO.AuthenticateSellffUserInfo(objAuthenticationBO);
        }

        public AuthenticationBO RegisterSellffUserInfo(AuthenticationBO objAuthenticationBO)
        {
            AuthenticationBO objResponseBO = objSellffDefaultDAO.RegisterSellffUserInfo(objAuthenticationBO);
            EmailTemplatesBO objEmailTemplatesBO = objSellffDefaultDAO.GetEmailTemplate(ConfigurationManager.AppSettings["RegEmail"].ToString());
            try
            {
                SendEmail(objResponseBO, objEmailTemplatesBO);
            }
            catch (Exception ex)
            {
                
            }            
            return objResponseBO;
        }

        public bool SendEmail(AuthenticationBO objAuthenticationBO, EmailTemplatesBO objEmailTemplatesBO)
        {
            String FROM = ConfigurationManager.AppSettings["FROMEmail"].ToString();  // Replace with your "From" address. This address must be verified.
            String TO = objAuthenticationBO.Email;
            String SUBJECT = objEmailTemplatesBO.EmailSubject;
            string emailBody = objEmailTemplatesBO.EmailTemplate;
            emailBody = emailBody.Replace("[UserName]", objAuthenticationBO.DisplayName);
            emailBody = emailBody.Replace("[ActivateURL]", ConfigurationManager.AppSettings["ActivateAppDomain"].ToString()+ objAuthenticationBO.InviteUniqueId); 
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

        public int CheckIfUserAlreadyEsists(string keystring)
        {
            return objSellffDefaultDAO.CheckIfUserAlreadyEsists(keystring);
        }

        public bool ActivateUserAccunt(string keystring)
        {
            return objSellffDefaultDAO.ActivateUserAccunt(keystring);
        }
    }
}