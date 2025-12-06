import { getConversationMessagesController } from "@/database/controllers/message.controller";
import { apiRequestHandler } from "@/lib/api-server";

export const GET = apiRequestHandler(getConversationMessagesController);
