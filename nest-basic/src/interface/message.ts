// export interface IMessage {
//     id:string,
//     message:String,
//     createdAt:Date
// }


export class MessageDto {
  id: string;
  message: string;
  createdAt: Date;
}

export class messageQueryDto {
    id?: string;
    search?:string;
}