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
        /// This method will Activate users account
        ///</summary>
        /// <param name="searchTerm"></param>
        [HttpGet, Route("api/SellffDefault/CheckIfUserAlreadyEsists/{keystring}/{hashky}")]
        public IHttpActionResult CheckIfUserAlreadyEsists(string keystring)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objSellffDefaultService.CheckIfUserAlreadyEsists(keystring)));
        }
    }
}
