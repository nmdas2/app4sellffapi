export interface ProfileInfo{
    UserId?: number;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    MobileNumber?: string;
    DateofBirth?: string;
    Gender?: string;
    UserName?: string;
    Password?: string;
    DisplayName?: string;
    UserRefProfileId?: number;
    userRefId?: number;
    Message?: string;
    UserIP?: string;
    MessageSentTime?: string;
    ProfilePicPath?:string;
    ProfileSummary?: string;    
    WebsiteLink?: string;
    FacebookLink?: string;
    LinkedInLink?: string;
    InstagramLink?: string;
    TwitterLink?: string;
    YouTubeLink?: string;
    GooglePlusLink?:string;
    SocialEmail?:string;
    MessageFrom?: number;
    MessageTo?: number;
    Views?: number;
    Posts?: number;
    City?: number;
    Occupation?: string;
    socialLinkType?: number;
    socialLink?: string;
    Rank?: number;
    ErrorMessage?:string;
    CreatedOn?:string;
    Reviews?: number;
    Investors?: number;
    Investments?: number;
    BannerPicPath?: string;
}
export interface userAboutInfo{
    AutoId: number;
    UserId?: number;
    About: string;
    ImagePath: string;
    CreatedIP?: string;
    Type: number;
    Section: number;
    Views: number;
    ProfilePicPath: string;
    Posts: number;
}
export interface userPostInfo{
    UserId: number;
    ImagePath: string;
    CreatedIP?: string;
    ContentType: number;
    Title: string;
    UserContent: string;
}