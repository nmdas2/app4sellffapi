export interface InviteUsers{
    UserId? : number;
    Name? : string;
    EmailId? : string;
    Phone? : string;
    InvitationSentDate? : string;
    IsUserRegistered? : boolean;
    InvitedBy?:number;
    CreatedOn? : string;
    InviteGuid? : string;
    ErrorMessage?: string;
}

