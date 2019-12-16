using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Sellff_API.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sellff_API.OAuth
{
    public class OAuthProvider : OAuthAuthorizationServerProvider
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
            var user = objSellffDefaultService.AuthenticateSellffUser(context.UserName, context.Password);
            if (string.IsNullOrWhiteSpace(context.UserName) || string.IsNullOrWhiteSpace(context.Password) ||
                user == null)
            {
                context.Rejected();
                context.SetError("invalid_grant", "The user name or password is incorrect.");
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim("email", user.Email));
            identity.AddClaim(new Claim("username", user.DisplayName));
            context.Validated(identity);
        }

    }
}