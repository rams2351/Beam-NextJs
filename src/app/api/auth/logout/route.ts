// app/api/auth/login/route.ts
import { logoutUserController } from "@/database/controllers/auth.controller";
import { apiRequestHandler } from "@/lib/api-server";

export const POST = apiRequestHandler(logoutUserController, false);
