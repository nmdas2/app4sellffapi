using Sellff_API.ADO;
using Sellff_API.Models;
using System.Collections.Generic;

namespace Sellff_API.Services
{
    public class ProfileInfoService
    {
        private readonly ProfileInfoDAO objProfileInfoDAO;

        public ProfileInfoService()
        {
            objProfileInfoDAO = new ProfileInfoDAO();
        }
        public List<ProfileInfoBO> GetUsersInfoBySearchTerm(string searchTerm)
        {
            return objProfileInfoDAO.GetUsersInfoBySearchTerm(searchTerm);
        }
        public List<ProfileInfoBO> SaveUserMessages(ProfileInfoBO objProfileInfoBO)
        {
            return objProfileInfoDAO.SaveUserMessages(objProfileInfoBO);
        }
        public List<ProfileInfoBO> GetAllUserMessages(int UserId)
        {
            return objProfileInfoDAO.GetAllUserMessages(UserId);
        }

        public List<PromotionsBO> GetAllUserPromotions(int UserId)
        {
            return objProfileInfoDAO.GetAllUserPromotions(UserId);
        }
        public List<PostsBO> GetAllUserPosts(int UserId)
        {
            return objProfileInfoDAO.GetAllUserPosts(UserId);
        }

        public List<UserAboutBO> GetUserAboutNGalleryInfo(int UserId, int SectionId)
        {
            return objProfileInfoDAO.GetUserAboutNGalleryInfo(UserId,SectionId);
        }
        public bool SaveUserAboutText(UserAboutBO objUserAboutBO)
        {
            return objProfileInfoDAO.SaveUserAboutText(objUserAboutBO);
        }
        public bool SaveUserGalleryImage(UserAboutBO objUserAboutBO)
        {
            return objProfileInfoDAO.SaveUserGalleryImage(objUserAboutBO);
        }
    }
}