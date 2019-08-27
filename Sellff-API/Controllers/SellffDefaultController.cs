﻿using log4net;
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
            var response = objSellffDefaultService.AuthenticateSellffUser(objAuthenticationBO);
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
        [HttpGet, Route("api/SellffDefault/CheckIfUserAlreadyEsists/{keystring}/{hashky}")]
        public IHttpActionResult CheckIfUserAlreadyEsists(string keystring)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.CheckIfUserAlreadyEsists(keystring)));
        }

        ///summary
        /// This method will check if user is already invited or registered
        ///</summary>
        /// <param name="keystring"></param>
        /// <param name="hashky"></param>
        [HttpGet, Route("api/SellffDefault/CheckIfUserAlreadyInvited/{keystring}/{hashky}")]
        public IHttpActionResult CheckIfUserAlreadyInvited(string keystring, int hashky)
        {
            string response = objSellffDefaultService.CheckIfUserAlreadyInvited(keystring, hashky);
            if(string.IsNullOrEmpty(response))
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, response));
            else
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.Conflict, response));
        }

        ///summary
        /// This method will update if users regisrers with invitation link shared
        ///</summary>
        /// <param name="keystring"></param>
        [HttpGet, Route("api/SellffDefault/UpdateUserRegisteredByInvitation/{keystring}")]
        public IHttpActionResult UpdateUserRegisteredByInvitation(string keystring)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.UpdateUserRegisteredByInvitation(keystring)));
        }

        ///summary
        /// This method will update if users regisrers with invitation link shared
        ///</summary>
        /// <param name="keystring"></param>
        [HttpGet, Route("api/SellffDefault/UpdateUserInvitationSentDate/{keystring}")]
        public IHttpActionResult UpdateUserInvitationSentDate(string keystring)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.UpdateUserInvitationSentDate(keystring)));
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
        /// <param name="keystring"></param>
        [HttpGet, Route("api/SellffDefault/GetInvitedUsersByUserId/{keystring}")]
        public IHttpActionResult GetInvitedUsersByUserId(int keystring)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.GetInvitedUsersByUserId(keystring)));
        }

    }
}
