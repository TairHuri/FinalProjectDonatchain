export interface Message {
    _id?:string;
    authorName: string;
    text: string;
    createdBy: string;
    ngoId:string;
    createdAt?:string;
}