export interface ProfileInfo{
    userId?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    mobileNumber?: string;
    dateofBirth?: string;
    gender?: string;
    userName?: string;
    password?: string;
    DisplayName?: string;
    userRefId: number;
    Message?: string;
    userIP?: string;
    MessageSentTime?: string;
    views?: number;
    socialLinkType?: number;
    socialLink?: string;
    WebsiteLink?: string;
    FacebookLink?: string;
    LinkedInLink?: string;
    InstagramLink?: string;
    TwitterLink?: string;
    YouTubeLink?: string;
    MessageFrom?: number;
    MessageTo?: number;
    ProfileSummary?: string;
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