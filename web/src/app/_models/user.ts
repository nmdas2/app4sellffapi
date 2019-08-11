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
}