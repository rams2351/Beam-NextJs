import { getTokenController } from "@/database/controllers/auth.controller";
import { apiRequestHandler } from "@/lib/api-server";

export const GET = apiRequestHandler(getTokenController);
