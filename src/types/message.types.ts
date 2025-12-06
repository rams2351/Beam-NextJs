import { IUser } from "./user.types";

export type MessageType = "text" | "image" | "file" | "system";

export interface IAttachment {
  url: string;
  fileType: string; // e.g., 'image/png'
  fileName: string;
}

export interface IMessage {
  _id: string;
  conversationId: string; // Reference to the parent chat

  // Sender can be an Object (populated) or a String (ID)
  senderId: IUser | string | null; // Null if it's a system message

  content: string;
  type: MessageType;
  attachments?: IAttachment[];

  readBy?: string[]; // Array of User IDs who saw this

  createdAt: string | Date;
  updatedAt: string | Date;
}
