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
}
export interface userAboutInfo{
    AutoId: number;
    UserId?: number;
    About: string;
    ImagePath: string;
    CreatedIP?: string;
    Type: number;
    Section: number;
}