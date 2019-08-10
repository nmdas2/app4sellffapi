export class Post {
    UserId: number;
    ContentType: number;
    Title: string;
    UserContent: string;
    CreatedOn?: string;
}
export class PostByGroup {
    key:string
    value:Post[]=[]
}