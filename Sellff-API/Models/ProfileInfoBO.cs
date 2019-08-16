using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Sellff_API.Models
{
    public class ProfileInfoBO
    {
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public string FirstName { get; set; }
        [DataMember]
        public string LastName { get; set; }
        [DataMember]
        public string Email { get; set; }
        [DataMember]
        public string MobileNumber { get; set; }
        [DataMember]
        public string DateofBirth { get; set; }
        [DataMember]
        public string Gender { get; set; }
        [DataMember]
        public string UserName { get; set; }
        [DataMember]
        public string Password { get; set; }
        [DataMember]
        public string DisplayName { get; set; }
        [DataMember]
        public int UserRefProfileId { get; set; }
        [DataMember]
        public int userRefId { get; set; }
        [DataMember]
        public string Message { get; set; }
        [DataMember]
        public string UserIP { get; set; }
        [DataMember]
        public string MessageSentTime { get; set; }
        [DataMember]
        public string ProfilePicPath { get; set; }
        [DataMember]
        public string ProfileSummary { get; set; }
        [DataMember]
        public string FacebookLink { get; set; }
        [DataMember]
        public string LinkedInLink { get; set; }
        [DataMember]
        public string InstagramLink { get; set; }
        [DataMember]
        public string TwitterLink { get; set; }
        [DataMember]
        public string YouTubeLink { get; set; }
        [DataMember]
        public int Views { get; set; }
        [DataMember]
        public int Posts { get; set; }
        [DataMember]
        public string City { get; set; }
        [DataMember]
        public string Occupation { get; set; }
        [DataMember]
        public int SocialLinkType { get; set; }
        [DataMember]
        public string SocialLink { get; set; }
        [DataMember]
        public int MessageTo { get; set; }
        [DataMember]
        public int MessageFrom { get; set; }
    }

    public class PromotionsBO
    {
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public int PromotionId { get; set; }
        [DataMember]
        public string Image { get; set; }
        [DataMember]
        public string Attachment { get; set; }
        [DataMember]
        public string Headline { get; set; }
        [DataMember]
        public string Detail { get; set; }
        [DataMember]
        public int Expiration { get; set; }
        [DataMember]
        public DateTime ExpiryDate { get; set; }
        [DataMember]
        public int RewardInShares { get; set; }
        [DataMember]
        public decimal RewardInCash { get; set; }
        [DataMember]
        public string FilterLocation { get; set; }
        [DataMember]
        public int FilterReviewsCount { get; set; }
        [DataMember]
        public decimal FilterPrice { get; set; }
        [DataMember]
        public int FilterScore { get; set; }
        [DataMember]
        public string FilterServicesNeeded { get; set; }
        [DataMember]
        public string CreatedOn { get; set; }
        [DataMember]
        public int CreatedBy { get; set; }
        [DataMember]
        public string CreatedIP { get; set; }
    }

    public class PostsBO
    {
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public int ContentType { get; set; }
        [DataMember]
        public string Title { get; set; }
        [DataMember]
        public string UserContent { get; set; }
        [DataMember]
        public string ImagePath { get; set; }
        [DataMember]
        public string CreatedOn { get; set; }
        [DataMember]
        public int CreatedBy { get; set; }
        [DataMember]
        public string CreatedIP { get; set; }
    }

    public class UserAboutBO
    {
        [DataMember]
        public int AutoId { get; set; }
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public string About { get; set; }
        [DataMember]
        public string ImagePath { get; set; }
        [DataMember]
        public int Type { get; set; }
        [DataMember]
        public string CreatedOn { get; set; }
        [DataMember]
        public int CreatedBy { get; set; }
        [DataMember]
        public string CreatedIP { get; set; }
        [DataMember]
        public int Section { get; set; }
        [DataMember]
        public int Views { get; set; }
        [DataMember]
        public string ProfilePicPath { get; set; }
        [DataMember]
        public int Posts { get; set; }
    }

    public class UserPostBO
    {
        [DataMember]
        public int ContentType { get; set; }
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public string Title { get; set; }
        [DataMember]
        public string Content { get; set; }
        [DataMember]
        public string ImagePath { get; set; }
        public string CreatedOn { get; set; }
        [DataMember]
        public int CreatedBy { get; set; }
        [DataMember]
        public string CreatedIP { get; set; }
    }

    public class UserReviewBO
    {
        [DataMember]
        public int ReviewId { get; set; }
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public string ReviewTitle { get; set; }
        [DataMember]
        public string ReviewContent { get; set; }
        [DataMember]
        public string CreatedOn { get; set; }
        [DataMember]
        public int CreatedBy { get; set; }
        [DataMember]
        public string CreatedIP { get; set; }
        [DataMember]
        public int Rating { get; set; }
        [DataMember]
        public int RatingGivenTo { get; set; }
        [DataMember]
        public int helpful { get; set; }
        [DataMember]
        public int IdForDataRequest { get; set; } = 0;
        [DataMember]
        public string ProfilePicPath { get; set; }
        [DataMember]
        public string DisplayName { get; set; }
    }

    public class UserLocalStorageBO
    {
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public string email { get; set; }
        [DataMember]
        public string password { get; set; }
        [DataMember]
        public string DisplayName { get; set; }
        [DataMember]
        public string token { get; set; }
        [DataMember]
        public int UserRefProfileId { get; set; }
        [DataMember]
        public int userRefId { get; set; }
        [DataMember]
        public bool ViewingSearchProfile { get; set; }
        [DataMember]
        public int SocialLinkType { get; set; }
        [DataMember]
        public string SocialLink { get; set; }
        [DataMember]
        public string Occupation { get; set; }
    }

}