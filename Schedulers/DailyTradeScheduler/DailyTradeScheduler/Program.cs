using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DailyTradeScheduler
{
    static class Program
    {
        private static readonly log4net.ILog Logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            //Application.Run(new Form1());
            log4net.Config.XmlConfigurator.Configure();
            CheckAllUsersTradeActivity();
        }

        private static void CheckAllUsersTradeActivity()
        {
            try
            {
                Logger.Info("Execution Started:" + DateTime.Now);
                SqlHelper.SqlHelper.ExecuteNonQuery(SqlHelper.SqlHelper.Connect(), CommandType.StoredProcedure, "Log_TradeTransactions");
                Logger.Info("Execution Ended:" + DateTime.Now);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
            }
        }
    }
}
