using Sellff_API.ADO;
using Sellff_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sellff_API.Services
{
    public class SellffDefaultService
    {
        SellffDefaultDAO objSellffDefaultDAO;

        public SellffDefaultService()
        {
            objSellffDefaultDAO = new SellffDefaultDAO();
        }
        public AuthenticationBO AuthenticateSellffUser(AuthenticationBO objAuthenticationBO)
        {
            return objSellffDefaultDAO.AuthenticateSellffUserInfo(objAuthenticationBO);
        }

        public AuthenticationBO RegisterSellffUserInfo(AuthenticationBO objAuthenticationBO)
        {
            return objSellffDefaultDAO.RegisterSellffUserInfo(objAuthenticationBO);
        }
    }
}