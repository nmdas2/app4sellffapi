using log4net;
using Sellff_API.Models;
using Sellff_API.Services;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Sellff_API.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class ProfileInfoController : ApiController
    {
        public static readonly ILog log4netlogger = log4net.LogManager.GetLogger("File");
        readonly ProfileInfoService objProfileInfoService;

        public ProfileInfoController()
        {
            objProfileInfoService = new ProfileInfoService();
        }

        ///summary
        /// This method will get all users info based on search term
        ///</summary>
        /// <param name="searchTerm"></param>
        [HttpGet, Route("api/ProfileInfo/GetUsersInfoBySearchTerm/{srchTerm}")]
        public IHttpActionResult GetUsersInfoBySearchTerm(string searchTerm)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUsersInfoBySearchTerm(searchTerm)));
        }

        ///summary
        /// This method will save user messages
        /// /// <param name="objProfileInfoBO"></param>
        ///</summary>
        [HttpPost, Route("api/ProfileInfo/SaveUserMessages")]
        public IHttpActionResult SaveUserMessages([FromBody]ProfileInfoBO objProfileInfoBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.SaveUserMessages(objProfileInfoBO)));
        }

        ///summary
        /// This method will get all users Messages info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/GetAllUserMessages/{UserId}")]
        public IHttpActionResult GetAllUserMessages(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetAllUserMessages(UserId)));
        }

        ///summary
        /// This method will get all users promotions info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/GetAllUserPromotions/{UserId}")]
        public IHttpActionResult GetAllUserPromotions(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetAllUserPromotions(UserId)));
        }

        ///summary
        /// This method will get all users Posts info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/GetAllUserPosts/{UserId}")]
        public IHttpActionResult GetAllUserPosts(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetAllUserPosts(UserId)));
        }

        ///summary
        /// This method will get user About info and gallery info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/GetUserAboutNGalleryInfo/{UserId}/{SectionId}")]
        public IHttpActionResult GetUserAboutNGalleryInfo(int UserId,int SectionId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUserAboutNGalleryInfo(UserId, SectionId)));
        }


        ///summary
        /// This method will Save user About info  based on UserId
        ///</summary>
        /// <param name="objUserAboutBO"></param>
        [HttpPost, Route("api/ProfileInfo/SaveUserAboutText")]
        public IHttpActionResult SaveUserAboutText([FromBody]UserAboutBO objUserAboutBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.SaveUserAboutText(objUserAboutBO)));
        }


        ///summary
        /// This method will Save user gallery info based on UserId
        ///</summary>
        /// <param name="objUserAboutBO"></param>
        [HttpPost, Route("api/ProfileInfo/SaveUserGalleryImagesPath")]
        public IHttpActionResult SaveUserGalleryImage([FromBody]UserAboutBO objUserAboutBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.SaveUserGalleryImage(objUserAboutBO)));
        }

        [HttpPost, Route("api/ProfileInfo/SaveImagesForGallery")]
        public HttpResponseMessage UploadJsonFile()
        {
            HttpResponseMessage response = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    //var filePath = HttpContext.Current.Server.MapPath("~/GalleryImages/" + postedFile.FileName);
                    var filePath = "F:/Projects/Ron/Sellff/Sellff-App/src/assets/selfprflimages/" + postedFile.FileName;
                    postedFile.SaveAs(filePath);
                }
            }
            return response;
        }
    }
}
