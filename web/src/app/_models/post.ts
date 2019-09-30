export class Post {
    UserId: number;
    ContentType: number;
    Title?: string;
    UserContent?: string;
    CreatedOn?: string;
    image?: FormData;
    ImagePath?:string;
    WebURL?:string;
    AutoId?: number;
}
export class PostByGroup {
    key:string
    value:Post[]=[]
}