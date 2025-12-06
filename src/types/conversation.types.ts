import { IUser } from "./user.types";

// 1. A lightweight version of a message for the sidebar preview
export interface ILastMessagePreview {
  content: string;
  senderId: string; // Just the ID is enough here
  createdAt: Date;
  isSystem?: boolean; // e.g., "You were added to the group"
}

// 2. The Conversation Data Structure
export interface IConversation {
  _id: string;
  type: "individual" | "group";

  // For Groups
  groupName?: string;
  groupAvatar?: string;
  admins?: string[]; // Array of User IDs

  // Participants: In the API response, these are usually populated Objects (IUser)
  participants: IUser[];

  // Embedded Data for Performance
  lastMessage?: ILastMessagePreview;

  // A Map/Object of unread counts: { "userId1": 5, "userId2": 0 }
  unreadCounts: Record<string, number>;

  createdAt: Date;
  updatedAt: Date;
}
