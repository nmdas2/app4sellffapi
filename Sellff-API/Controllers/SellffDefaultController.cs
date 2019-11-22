using log4net;
using Sellff_API.Models;
using Sellff_API.Services;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Sellff_API.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class SellffDefaultController : ApiController
    {
        public static readonly ILog log4netlogger = log4net.LogManager.GetLogger("File");
        SellffDefaultService objSellffDefaultService;

        public SellffDefaultController()
        {
            objSellffDefaultService = new SellffDefaultService();
        }

        ///summary
        /// This method will check if user is in Sellff database, if so sends details back
        ///</summary>
        /// <param name="AuthenticationBO"></param>

        [HttpPost, Route("api/SellffDefault/AuthenticateSellffUserInfo")]
        public IHttpActionResult AuthenticateSellffUserInfo([FromBody]ProfileInfoBO objAuthenticationBO)
        {
            var response = objSellffDefaultService.AuthenticateSellffUser(objAuthenticationBO.UserName, objAuthenticationBO.Password);
            if(!string.IsNullOrEmpty(response.ErrorMessage))
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.Unauthorized, response));
            else
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, response));

        }

        ///summary
        /// This method will check user infomation, if not there in DB, registers users
        ///</summary>
        /// <param name="AuthenticationBO"></param>
        [HttpPost, Route("api/SellffDefault/RegisterSellffUserInfo")]
        public IHttpActionResult RegisterSellffUserInfo([FromBody]AuthenticationBO objAuthenticationBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.RegisterSellffUserInfo(objAuthenticationBO)));
        }
        
        ///summary
        /// This method will Activate users account
        ///</summary>
        /// <param name="searchTerm"></param>
        [HttpGet, Route("api/SellffDefault/ActivateUserAccunt/{keystring}")]
        public IHttpActionResult ActivateUserAccunt(string keystring)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.ActivateUserAccunt(keystring)));
        }

        ///summary
        /// This method will check if user already exists
        ///</summary>
        /// <param name="keystring"></param>
        /// <param name="hashky"></param>
        [HttpGet, Route("api/SellffDefault/CheckIfUserAlreadyEsists/{keystring}/{displayname}/{hashky}")]
        public IHttpActionResult CheckIfUserAlreadyEsists(string keystring, string displayname)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.CheckIfUserAlreadyEsists(keystring, displayname)));
        }

        ///summary
        /// This method will check if user is already invited or registered
        ///</summary>
        /// <param name="EmailId"></param>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/SellffDefault/CheckIfUserAlreadyInvited/{EmailId}/{UserId}")]
        public IHttpActionResult CheckIfUserAlreadyInvited(string EmailId, int UserId)
        {
            string response = objSellffDefaultService.CheckIfUserAlreadyInvited(EmailId, UserId);
            if(string.IsNullOrEmpty(response))
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, response));
            else
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.Conflict, response));
        }

        ///summary
        /// This method will update if users regisrers with invitation link shared
        ///</summary>
        /// <param name="InviteGuid"></param>
        [HttpGet, Route("api/SellffDefault/UpdateUserRegisteredByInvitation/{InviteGuid}")]
        public IHttpActionResult UpdateUserRegisteredByInvitation(string InviteGuid)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.UpdateUserRegisteredByInvitation(InviteGuid)));
        }

        ///summary
        /// This method will update if users regisrers with invitation link shared
        ///</summary>
        /// <param name="InviteGuid"></param>
        [HttpGet, Route("api/SellffDefault/UpdateUserInvitationSentDate/{InviteGuid}")]
        public IHttpActionResult UpdateUserInvitationSentDate(string InviteGuid)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.UpdateUserInvitationSentDate(InviteGuid)));
        }

        ///summary
        /// This method will Save Users invitation details
        ///</summary>
        /// <param name="InviteUsersBO"></param>
        [HttpPost, Route("api/SellffDefault/SaveUserInviteDetails")]
        public IHttpActionResult SaveUserInviteDetails([FromBody]InviteUsersBO objInviteUsersBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.SaveUserInviteDetails(objInviteUsersBO)));
        }

        ///summary
        /// This method will Get all the users invited by UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/SellffDefault/GetInvitedUsersByUserId/{UserId}")]
        public IHttpActionResult GetInvitedUsersByUserId(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.GetInvitedUsersByUserId(UserId)));
        }

        ///summary
        /// This method will Get all the users invited by UserId
        ///</summary>
        /// <param name="InviteGuid"></param>
        [HttpGet, Route("api/SellffDefault/GetInvitedUsersDetailsByGuidForReg/{InviteGuid}")]
        public IHttpActionResult GetInvitedUsersDetailsByGuidForReg(string InviteGuid)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.GetInvitedUsersDetailsByGuidForReg(InviteGuid)));
        }

        ///summary
        /// This method will Get all the users invited by UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/SellffDefault/SocialLinksByUserId/{UserId}")]
        public IHttpActionResult SocialLinksByUserId(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.SocialLinksByUserId(UserId)));
        }

        ///summary
        /// This method will Get all the users invited by UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/SellffDefault/HeaderWidgetsCountByUserId/{UserId}")]
        public IHttpActionResult HeaderWidgetsCountByUserId(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.HeaderWidgetsCountByUserId(UserId)));
        }
        /// <summary>
        /// This for forgot password checking
        /// </summary>
        /// <param name="email"></param>
        /// <param name="noval"></param>
        /// <returns></returns>
        [HttpGet, Route("api/SellffDefault/forgotpasswordinfo/{email}/{noval}")]
        public IHttpActionResult Forgotpasswordinfo(string email,int noval)
        {
            if (objSellffDefaultService.Forgotpasswordinfo(email))
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, true));
            else
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, false));
        }
        /// <summary>
        /// This is to change password
        /// </summary>
        /// <param name="email"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        [HttpGet, Route("api/SellffDefault/Changepasswordinfo/{email}/{UserId}")]
        public IHttpActionResult Changepasswordinfo(string email, int UserId)
        {
            if (objSellffDefaultService.Changepasswordinfo(email,UserId))
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, true));
            else
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, false));
        }
    }
}
