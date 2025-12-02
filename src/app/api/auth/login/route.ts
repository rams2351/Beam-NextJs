// app/api/auth/login/route.ts
import { loginUserController } from "@/database/controllers/auth.controller";
import { apiRequestHandler } from "@/lib/api-server";

export const POST = apiRequestHandler(loginUserController, false);
