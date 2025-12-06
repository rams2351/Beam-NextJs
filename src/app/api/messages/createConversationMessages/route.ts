import { createMessageController } from "@/database/controllers/message.controller";
import { apiRequestHandler } from "@/lib/api-server";

// POST method for creating messages
export const POST = apiRequestHandler(createMessageController);
