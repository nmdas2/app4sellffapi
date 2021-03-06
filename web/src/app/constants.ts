const isProduction = false;
export const constants = {
    AppName: "Sellff",
    //DomainURL: 'http://localhost:50517/api/',
    DomainURL: 'http://apollostage2.quad1test.com/practice/api/',
    SignalRURL:'http://localhost:50517/signalr/',
    TokenURL:'http://localhost:50517/token',
    //DomainURL: 'http://4sellff.com/sellffapi/api/',
    ImagesPath: './././assets/selfprflimages/',
    PostImagesPath: './././assets/selfprflimages/postimages/',
    AboutPath: '/profileinfo/about',
    AppDomain:'http://4sellff.com/',
    BuyShares: 1000,
    SellShares: 1000,
    forgetMsgSuccess: 'your password is reset, new password has been sent to your mail',
    forgetMsgError: 'given email is not registered with sellff'
};
export const enum UploadType {
    Image = 1,
    Document = 2
}
export const enum ProfileSection {
    About = 1,
    Posts = 2,
    Message = 3
}
export const enum UserSocialLinksInfo {
    Website = 1,
    Twitter = 2,
    LinkedIn = 3,
    Facebook = 4,
    Googleplus = 5,
    YouTube = 6,
    Instagram = 7,
}