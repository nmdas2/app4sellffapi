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
        public string WebsiteLink { get; set; }
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
        public string GooglePlusLink { get; set; }
        [DataMember]
        public string PinInterestLink { get; set; }
        [DataMember]
        public string SocialEmail { get; set; }
        [DataMember]
        public int Views { get; set; }
        [DataMember]
        public int Posts { get; set; }
        [DataMember]
        public int Reviews { get; set; }
        [DataMember]
        public int Investors { get; set; }
        [DataMember]
        public int Investments { get; set; }
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
        [DataMember]
        public int Rank { get; set; }
        [DataMember]
        public string CreatedOn { get; set; }
        [DataMember]
        public string ErrorMessage { get; set; } = "";
        [DataMember]
        public string BannerPicPath { get; set; }
        [DataMember]
        public DateTime MessagesDateForSorting { get; set; }
        [DataMember]
        public string MessageToName { get; set; }
        [DataMember]
        public bool IsMsgFromLoggedInUser { get; set; } = false;
        [DataMember]
        public bool IsRead { get; set; } = true;
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
        public int AutoId { get; set; }
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
        [DataMember]
        public string MonthYear { get; set; }
        [DataMember]
        public string WebURL { get; set; }
    }

    public class PostGroups
    {
        public PostGroups()
        {
            objPostsList = new List<PostsBO>();
        }
        [DataMember]
        public List<PostsBO> objPostsList;
        [DataMember]
        public string MonthYear { get; set; }
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
        public string BannerPicPath { get; set; }
        [DataMember]
        public int Posts { get; set; }
        [DataMember]
        public string City { get; set; }
        [DataMember]
        public string Occupation { get; set; }
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
        public string UserContent { get; set; }
        [DataMember]
        public string ImagePath { get; set; }
        public string CreatedOn { get; set; }
        [DataMember]
        public int CreatedBy { get; set; }
        [DataMember]
        public string CreatedIP { get; set; }
        [DataMember]
        public string WebURL { get; set; }
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
        [DataMember]
        public int Performance { get; set; }
        [DataMember]
        public int Communication { get; set; }
        [DataMember]
        public int QOW { get; set; }
        [DataMember]
        public int Starts5 { get; set; } = 0;
        [DataMember]
        public int Starts4 { get; set; } = 0;
        [DataMember]
        public int Starts3 { get; set; } = 0;
        [DataMember]
        public int Starts2 { get; set; } = 0;
        [DataMember]
        public int Starts1 { get; set; } = 0;
        [DataMember]
        public bool ReviewAlreadyGiven { get; set; }
        [DataMember]
        public decimal OverallRating { get; set; }
        [DataMember]
        public int TotalRatingsCount { get; set; }
        [DataMember]
        public int NoofRatingsGiven { get; set; }
        [DataMember]
        public bool HelpId { get; set; } = false;
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
    public class UserServiceTypesBO
    {
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public string ServiceName { get; set; }
        [DataMember]
        public int ServiceType { get; set; }
        [DataMember]
        public int ServiceMatchCount { get; set; }
        [DataMember]
        public string UserIP { get; set; }
    }

    public class UserTransactionsBO
    {
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public int ShareOwnerId { get; set; }
        [DataMember]
        public int UserProfileId { get; set; }
        [DataMember]
        public string DisplayName { get; set; }
        [DataMember]
        public int Age { get; set; }
        [DataMember]
        public string City { get; set; }
        [DataMember]
        public string ShareSymbol { get; set; }
        [DataMember]
        public int AvailableShareQty { get; set; }
        [DataMember]
        public decimal LastTradeSharePrice { get; set; } = 0;
        [DataMember]
        public decimal AskPrice { get; set; }
        [DataMember]
        public decimal BuyPrice { get; set; }
        [DataMember]
        public int PurchasedShareQty { get; set; }
        [DataMember]
        public decimal TotalValueAtCurrentPrice { get; set; }
        [DataMember]
        public decimal TotalValueAtPurchasedPrice { get; set; }
        [DataMember]
        public decimal ChangedPrice { get; set; }
        [DataMember]
        public decimal TotalMarketValue { get; set; }
        [DataMember]
        public int BuySellQty { get; set; }
        [DataMember]
        public int BuySellActionType { get; set; }
        [DataMember]
        public string ErrorMessage { get; set; }
        [DataMember]
        public decimal PercentageValue { get; set; } = 0;
        [DataMember]
        public Int64 CreatedTicks { get; set; }
        [DataMember]
        public string CreatedOn { get; set; }
        [DataMember]
        public string color { get; set; }
        [DataMember]
        public int TotalPurchasedShareQty { get; set; }
        [DataMember]
        public decimal MarketCap { get; set; }
        [DataMember]
        public int Investors { get; set; }
        [DataMember]
        public decimal ProfitRLoss { get; set; }
        [DataMember]
        public decimal ProfitRLossPercentage { get; set; }
        [DataMember]
        public decimal pricechange { get; set; }
        [DataMember]
        public bool profitlossinnegitive { get; set; } = false;
        [DataMember]
        public string profitlosscolor { get; set; }
        [DataMember]
        public bool pricechangeinnegitive { get; set; } = false;
        [DataMember]
        public decimal LastDayClosePrice { get; set; }
        [DataMember]
        public decimal TotalInvested { get; set; }
    }

    public class UserShareDetailsBO
    {
        [DataMember]
        public long DayDate { get; set; }
        [DataMember]
        public decimal SharePriceValue { get; set; }
        [DataMember]
        public int onlyDate { get; set; }
    }

}