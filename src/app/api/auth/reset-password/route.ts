import { resetUserPasswordController } from "@/database/controllers/auth.controller";
import { apiRequestHandler } from "@/lib/api-server";

export const POST = apiRequestHandler(resetUserPasswordController, false);
