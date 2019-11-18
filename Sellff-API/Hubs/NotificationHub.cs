using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Sellff_API.Services;

namespace Sellff_API.Hubs
{
    public class NotificationHub : Hub
    {
        public void GetUserNotification(int UserId)
        {
            SellffDefaultService objSellffDefaultService = new SellffDefaultService();
            var userData = objSellffDefaultService.HeaderWidgetsCountByUserId(UserId);
            Clients.All.SetUserNotification(userData);
        }
    }
}