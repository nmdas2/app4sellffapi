-- =============================================  
-- Author:  Venu babu  
-- Create date: 16-07-2019  
-- Description: This will get list of users with search term  
-- =============================================  
ALTER PROCEDURE [dbo].[Proc_GetProfilesBySearchTerm] 
@SearchTerm Varchar(200)  
AS  
BEGIN  
 SET NOCOUNT ON;  
  
 SELECT * FROM (  
  
 SELECT UsersInfo.UserId,UsersInfo.Email,UsersInfo.DisplayName,UsersInfo.ProfilePicPath,UsersInfo.Rank,UsersInfo.Occupation,UsersInfo.Reviews,City  
 ,UsersInfo.BannerPicPath,UsersInfo.CreatedOn  
 FROM UsersXMatchInfo  
 INNER JOIN UsersInfo ON UsersInfo.UserId = UsersXMatchInfo.UserId  
 WHERE ServiceType = 1 AND ServiceName LIKE '%'+@SearchTerm+'%'  
   
 UNION ALL  
  
 SELECT UsersInfo.UserId,UsersInfo.Email,UsersInfo.DisplayName,UsersInfo.ProfilePicPath,UsersInfo.Rank,UsersInfo.Occupation,UsersInfo.Reviews,City   
 ,UsersInfo.BannerPicPath,UsersInfo.CreatedOn    
 FROM UsersInfo WHERE DisplayName LIKE '%'+@SearchTerm+'%'  
 ) AS RESULTS  
 GROUP BY UserId,Email,DisplayName,ProfilePicPath,[Rank],Occupation,Reviews,City,BannerPicPath,CreatedOn ORDER BY [Rank] DESC  
END  