import { getUserController } from "@/database/controllers/user.controller";
import { apiRequestHandler } from "@/lib/api-server";

export const GET = apiRequestHandler(getUserController);
