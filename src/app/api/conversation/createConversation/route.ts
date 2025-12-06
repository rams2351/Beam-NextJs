import { createConversationController } from "@/database/controllers/conversation.controller";
import { apiRequestHandler } from "@/lib/api-server";

export const POST = apiRequestHandler(createConversationController);
