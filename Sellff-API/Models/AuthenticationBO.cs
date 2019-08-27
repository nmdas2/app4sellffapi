using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Sellff_API.Models
{
    [DataContract]
    public class AuthenticationBO
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
        public string ErrorMessage { get; set; }
        [DataMember]
        public string ProfilePicPath { get; set; }
        [DataMember]
        public int UserRefProfileId { get; set; }
        [DataMember]
        public string Occupation { get; set; }
        [DataMember]
        public int UniqueId { get; set; }
        [DataMember]
        public int Rank { get; set; }
        [DataMember]
        public string Age { get; set; }
        [DataMember]
        public string City { get; set; }
        [DataMember]
        public string InviteUniqueId { get; set; }
    }

    [DataContract]
    public class EmailTemplatesBO
    {
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public string EmailTemplate { get; set; }
        [DataMember]
        public int TemplateId { get; set; }
        [DataMember]
        public string EmailSubject { get; set; }
        [DataMember]
        public string SentTo { get; set; }
        [DataMember]
        public string SentFrom { get; set; }
        [DataMember]
        public string CC { get; set; }
        [DataMember]
        public string BCC { get; set; }
        [DataMember]
        public string StatusMessage { get; set; }
        [DataMember]
        public bool IsSent { get; set; }
    }

    [DataContract]
    public class InviteUsersBO
    {
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string EmailId { get; set; }
        [DataMember]
        public string Phone { get; set; }
        [DataMember]
        public string InvitationSentDate { get; set; }
        [DataMember]
        public bool IsUserRegistered { get; set; }
        [DataMember]
        public int InvitedBy { get; set; }
        [DataMember]
        public string CreatedOn { get; set; }
        [DataMember]
        public string InviteGuid { get; set; }
        [DataMember]
        public string ErrorMessage { get; set; }
    }
}