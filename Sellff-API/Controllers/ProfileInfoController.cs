﻿using log4net;
using Sellff_API.Models;
using Sellff_API.Services;
using System;
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
        /// This method will get all users Messages info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/GetUserMessagesBetween2Users/{UserId}/{RecepId}")]
        public IHttpActionResult GetUserMessagesBetween2Users(int UserId, int RecepId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUserMessagesBetween2Users(UserId, RecepId)));
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
        [HttpGet, Route("api/ProfileInfo/GetUserAboutNGalleryInfo/{UserId}")]
        public IHttpActionResult GetUserAboutNGalleryInfo(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUserAboutNGalleryInfo(UserId)));
        }

        ///summary
        /// This method will remove gallery info image based on UserId and imageid
        ///</summary>
        /// <param name="UserId"></param>
        /// <param name="GalId"></param>
        [HttpGet, Route("api/ProfileInfo/RemoveAboutImageFromGalleryByUserId/{UserId}/{GalId}")]
        public IHttpActionResult RemoveAboutImageFromGalleryByUserId(int UserId, int GalId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.RemoveAboutImageFromGalleryByUserId(UserId, GalId)));
        }

        ///summary
        /// This method will remove gallery info image based on UserId and imageid
        ///</summary>
        /// <param name="UserId"></param>
        /// <param name="PostId"></param>
        [HttpGet, Route("api/ProfileInfo/RemovePostsByUserIdNPostId/{UserId}/{PostId}")]
        public IHttpActionResult RemovePostsByUserIdNPostId(int UserId, int PostId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.RemovePostsByUserIdNPostId(UserId, PostId)));
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
                    var picFileName = "0000000" + DateTime.Now.ToString("yyyy-MM-ddTHH-mm-ss") + postedFile.FileName;
                    picFileName = picFileName.Replace(" ", "-");
                    //var filePath = HttpContext.Current.Server.MapPath("~/GalleryImages/" + postedFile.FileName);
                    //var filePath = "F:/Projects/Ron/Das/web/src/assets/selfprflimages/" + postedFile.FileName;
                    var filePath = "C:/www/dev-sellff/assets/selfprflimages/" + picFileName;
                    postedFile.SaveAs(filePath);
                }
            }
            return response;
        }

        [HttpPost, Route("api/ProfileInfo/SaveImagesForPost")]
        public HttpResponseMessage UploadPostJsonFile()
        {
            HttpResponseMessage response = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    var picFileName = "0000000" + DateTime.Now.ToString("yyyy-MM-ddTHH-mm-ss") + postedFile.FileName;
                    picFileName = picFileName.Replace(" ", "-");
                    //var filePath = "F:/Projects/Ron/Das/web/src/assets/selfprflimages/postimages/" + postedFile.FileName;
                    var filePath = "C:/www/dev-sellff/assets/selfprflimages/postimages/" + picFileName;
                    postedFile.SaveAs(filePath);
                }
            }
            return response;
        }

        ///summary
        /// This method will get all users Messages info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/GetSummaryResults")]
        public IHttpActionResult GetSummaryResults(string parttext)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUsersInfoBySearchTerm(parttext)));
        }

        ///summary
        /// This method will Save user Post section text messgaes info  based on UserId
        ///</summary>
        /// <param name="objUserAboutBO"></param>
        [HttpPost, Route("api/ProfileInfo/SaveUserPostTextMessages")]
        public IHttpActionResult SaveUserPostTextMessages([FromBody]UserPostBO objUserPostBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.SaveUserPostTextMessages(objUserPostBO)));
        }

        ///summary
        /// This method will Save user Post section images info  based on UserId
        ///</summary>
        /// <param name="objUserAboutBO"></param>
        //[HttpPost, Route("api/ProfileInfo/SaveUserPostImages")]
        //public IHttpActionResult SaveUserPostImages([FromBody]UserPostBO objUserPostBO)
        //{
        //    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.SaveUserPostImages(objUserPostBO)));
        //}

        ///summary
        /// This method will Save user Views number info  based on UserId
        ///</summary>
        /// <param name="objUserAboutBO"></param>
        [HttpPost, Route("api/ProfileInfo/UpdateUsersViewCount")]
        public IHttpActionResult UpdateUsersViewCount([FromBody]ProfileInfoBO objProfileInfoBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.UpdateUsersViewCount(objProfileInfoBO)));
        }

        ///summary
        /// This method will Save user Views number info  based on UserId
        ///</summary>
        /// <param name="objUserAboutBO"></param>
        [HttpPost, Route("api/ProfileInfo/UpdateUsersSocialInfo")]
        public IHttpActionResult UpdateUsersSocialInfo([FromBody]ProfileInfoBO objProfileInfoBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.UpdateUsersSocialInfo(objProfileInfoBO)));
        }


        ///summary
        /// This method will Save user About info  based on UserId
        ///</summary>
        /// <param name="objUserAboutBO"></param>
        [HttpPost, Route("api/ProfileInfo/SaveReviewForUsers")]
        public IHttpActionResult SaveReviewForUsers([FromBody]UserReviewBO objUserReviewBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.SaveReviewForUsers(objUserReviewBO)));
        }

        ///summary
        /// This method will get all users Messages info based on UserId
        ///</summary>
        /// <param name="objUserLocalStorageBO"></param>
        [HttpGet, Route("api/ProfileInfo/GetUserReviewsByUser/{Infoval}/{loggedInUserId}")]
        public IHttpActionResult GetAllUserReviewsByUser(int Infoval,int loggedInUserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetAllUserReviewsByUser(Infoval, loggedInUserId)));
        }

        ///summary
        /// This method will get all users Messages info based on UserId
        ///</summary>
        /// <param name="objUserReviewBO"></param>
        [HttpPost, Route("api/ProfileInfo/UpdateUsersReviewAsHelpful")]
        public IHttpActionResult UpdateUsersReviewAsHelpful([FromBody]UserReviewBO objUserReviewBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.UpdateUsersReviewAsHelpful(objUserReviewBO)));
        }

        ///summary
        /// This method will get all users Messages info based on UserId
        ///</summary>
        /// <param name="objUserLocalStorageBO"></param>
        [HttpGet, Route("api/ProfileInfo/GetCurrentUserRatingById/{Infoval}")]
        public IHttpActionResult GetCurrentUserRatingById(int Infoval)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetCurrentUserRatingById(Infoval)));
        }

        ///summary
        /// This method will get all users info based on search term
        ///</summary>
        /// <param name="searchTerm"></param>
        [HttpGet, Route("api/ProfileInfo/GetUserProfileInfoByUserId/{loginUser}")]
        public IHttpActionResult GetUserProfileInfoByUserId(int loginUser)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUserProfileInfoByUserId(loginUser)));
        }

        ///summary
        /// This method will get all users Posts info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/GetUserPostsAsGroups/{UserId}")]
        public IHttpActionResult GetUserPostsAsGroups(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUserPostsAsGroups(UserId)));
        }

        ///summary
        /// This method will Save user About info  based on UserId
        ///</summary>
        /// <param name="objUserTransactionBO"></param>
        [HttpPost, Route("api/ProfileInfo/SaveUserBuySellTransactions")]
        public IHttpActionResult SaveUserBuySellTransactions([FromBody]UserTransactionsBO objUserTransactionBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.SaveUserBuySellTransactions(objUserTransactionBO)));
        }

        ///summary
        /// This method will Save Services to db by type
        ///</summary>
        /// <param name="objUserServiceTypesBO"></param>
        [HttpPost, Route("api/ProfileInfo/SaveUserServiceTypes")]
        public IHttpActionResult SaveUserServiceTypes([FromBody]UserServiceTypesBO objUserServiceTypesBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.SaveUserServiceTypes(objUserServiceTypesBO)));
        }

        ///summary
        /// This method will get all users Posts info based on UserId
        ///</summary>
        /// <param></param>
        [HttpGet, Route("api/ProfileInfo/GetAllUserServiceTypes")]
        public IHttpActionResult GetAllUserServiceTypes()
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetAllUserServiceTypes()));
        }

        ///summary
        /// This method will get all users Posts info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/GetUserServiceTypesByUserId/{UserId}")]
        public IHttpActionResult GetUserServiceTypesByUserId(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUserServiceTypesByUserId(UserId)));
        }

        ///summary
        /// This method will get all users Posts info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        /// <param name="TypeId"></param>
        [HttpGet, Route("api/ProfileInfo/GetUserServiceTypesByUserIdNTypeId/{UserId}/{TypeId}")]
        public IHttpActionResult GetUserServiceTypesByUserIdNTypeId(int UserId, int TypeId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUserServiceTypesByUserIdNTypeId(UserId, TypeId)));
        }

        ///summary
        /// This method will Save Services to db by type
        ///</summary>
        /// <param name="objUserServiceTypesBO"></param>
        [HttpPost, Route("api/ProfileInfo/RemoveUserServiceByType")]
        public IHttpActionResult RemoveUserServiceByType([FromBody]UserServiceTypesBO objUserServiceTypesBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.RemoveUserServiceByType(objUserServiceTypesBO)));
        }

        ///summary
        /// This method will Save Services to db by type
        ///</summary>
        /// <param name="objUserTransactionsBO"></param>
        [HttpPost, Route("api/ProfileInfo/SaveUserBuySellTransactionDetails")]
        public IHttpActionResult SaveUserBuySellTransactionDetails([FromBody]UserTransactionsBO objUserTransactionsBO)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.SaveUserBuySellTransactionDetails(objUserTransactionsBO)));
        }

        ///summary
        /// This method will get user prfile details by UserId and typeid
        ///</summary>
        /// <param name="UserId"></param>
        /// <param name="UserProfileId"></param>
        [HttpGet, Route("api/ProfileInfo/GetUserProfileDetailsByUserIdNUserProfileId/{UserId}/{UserProfileId}")]
        public IHttpActionResult GetUserProfileDetailsByUserIdNUserProfileId(int UserId, int UserProfileId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUserProfileDetailsByUserIdNUserProfileId(UserId, UserProfileId)));
        }

        ///summary
        /// This method will get all users Posts info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/GetUserInvestimentDetailsByUserId/{UserId}")]
        public IHttpActionResult GetUserInvestimentDetailsByUserId(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUserInvestimentDetailsByUserId(UserId)));
        }

        ///summary
        /// This method will get all users Posts info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/FindSharePriceValuesByUserId/{UserId}")]
        public IHttpActionResult FindSharePriceValuesByUserId(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.FindSharePriceValuesByUserId(UserId)));
        }

        ///summary
        /// This method will get all users Messages info based on UserId
        ///</summary>
        /// <param name="UserId"></param>
        [HttpGet, Route("api/ProfileInfo/GetUnReadMessagesCountByUserId/{UserId}")]
        public IHttpActionResult GetUnReadMessagesCountByUserId(int UserId)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.GetUnReadMessagesCountByUserId(UserId)));
        }

        [HttpPost, Route("api/ProfileInfo/SaveUserProfilePic/{PicType}/{UserId}")]
        public HttpResponseMessage UploadJsonFile4ProfilePic(int PicType, int UserId)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            string Profilefilepath = "";
            if (httpRequest.Files.Count > 0)
            {
                foreach (string file in httpRequest.Files)
                {
                    var filePath = "";
                    var postedFile = httpRequest.Files[file];
                    var picFileName = "0000000"+Convert.ToString(UserId) + DateTime.Now.ToString("yyyy-MM-ddTHH-mm-ss") +  postedFile.FileName;
                    picFileName = picFileName.Replace(" ", "-");
                    if (PicType == 1)
                        filePath = "C:/www/dev-sellff/assets/profilepics/" + picFileName;
                    else
                        filePath = "C:/www/dev-sellff/assets/bannerpics/" + picFileName;

                    Profilefilepath = picFileName;
                    //var filePath = "C:/www/dev-sellff/assets/profilepics/" + postedFile.FileName;
                    postedFile.SaveAs(filePath);
                }
                response = Request.CreateResponse(HttpStatusCode.OK, objProfileInfoService.UpdateUserProfilePicById(UserId, Profilefilepath, PicType));
            }
            return response;
        }


    }
}
