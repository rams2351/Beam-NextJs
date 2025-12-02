// ==========================================
// 1. GET USER CONTROLLER

import { ResponseHandler } from "@/lib/api-server";
import { IUser } from "@/types/auth";
import { NextRequest } from "next/server";

// ==========================================
export async function getUserController(
  req: NextRequest,
  context: any, // We underscore it if we don't use route params
  user: IUser // <--- The user is injected here as the 3rd argument
) {
  // Now you can access properties safely
  const userId = user._id;

  // Example: Return the data found in the injected user object
  return ResponseHandler.success(
    {
      profile: user,
    },
    "User profile fetched successfully"
  );
}
