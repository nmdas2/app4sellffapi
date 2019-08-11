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
    displayName?: string;
    userRefId: number;
    message?: string;
    userIP?: string;
    messageSentTime?: string;
    views: number;
    socialLinkType: number;
    socialLink: string;
    FacebookLink: string;
    LinkedInLink: string;
    InstagramLink: string;
    TwitterLink: string;
    YouTubeLink: string;
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