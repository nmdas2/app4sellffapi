using Microsoft.Owin.Security.OAuth;
using Sellff_API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace Sellff_API
{
    public class OAuthProvider:OAuthAuthorizationServerProvider
    {
        /// <summary>
        /// This method validates the client device
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // For now we are not checking any client device validtion.
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            SellffDefaultService objSellffDefaultService = new SellffDefaultService();
            if (string.IsNullOrWhiteSpace(context.UserName) || string.IsNullOrWhiteSpace(context.Password) ||
                objSellffDefaultService.AuthenticateSellffUser(context.UserName, context.Password) == null)
            {
                context.Rejected();
                context.SetError("invalid_grant", "The user name or password is incorrect.");              
            }

            List<Claim> claims = new List<Claim>() { new Claim("sub", context.UserName) };
            claims.AddRange(context.Scope.Select(x => new Claim("urn:oauth:scope", x)));
            var identity = new ClaimsIdentity(claims, "Application", "sub", "role");
            context.Validated(identity);
        }
    }
}