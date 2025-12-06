// types/api.types.ts
import { IMessage } from "@/types/message.types";

export interface FetchMessagesResponse {
  success: boolean;
  message: string;
  // These are at the root level because ResponseHandler spreads them
  messages: IMessage[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    nextPage: number | null;
  };
}
