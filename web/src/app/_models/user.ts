export class User {
    UserId: number;
    email: string;
    password: string;
    DisplayName: string;
    token: string;
    UserRefProfileId: number;
    ViewingSearchProfile: boolean = false;
    SocialLinkType: number;
    SocialLink: string;
    Occupation: string;
    UniqueId?: number = 0;
    Rank?: number = 0;
    ProfilePicPath?: string;
    ErrorMessage?: String;
    Age?:number;
    City?:string;
}