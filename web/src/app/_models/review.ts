export class Review {
    UserId: number;
    ReviewTitle: string;
    ReviewContent: string;
    CreatedOn?: string;
    Rating: number = 0;
    RatingGivenTo: number;
    helpful?: number;
    CreatedIP?: string;
    CreatedBy?: number;
    ReviewId?:number;
    ProfilePicPath?: string;
    DisplayName?: string;
    Performance:number = 0;
    Communication: number = 0;
    QOW: number = 0;
    Starts5?: number = 0;
    Starts4?: number = 0;
    Starts3?: number = 0;
    Starts2?: number = 0;
    Starts1?: number = 0;
    ReviewAlreadyGiven?: boolean = false;
}