import { getUserConversatonController } from "@/database/controllers/conversation.controller";
import { apiRequestHandler } from "@/lib/api-server";

export const GET = apiRequestHandler(getUserConversatonController);
