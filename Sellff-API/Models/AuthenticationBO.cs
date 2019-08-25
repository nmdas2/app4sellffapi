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
}