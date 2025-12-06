// ==========================================
// 1. GET USER CONTROLLER

import UserModel from "@/database/models/user.model";
import { ResponseHandler } from "@/lib/api-server";
import { IUser } from "@/types/user.types";
import { NextRequest } from "next/server";

// ==========================================
export async function getUserController(
  req: NextRequest,
  context: any, // We underscore it if we don't use route params
  user: IUser // <--- The user is injected here as the 3rd argument
) {
  return ResponseHandler.success(
    {
      data: user,
    },
    "User profile fetched successfully"
  );
}

export async function getUsersController(req: NextRequest, context: any, user: IUser) {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const query = searchParams.get("query") || "";
  const skip = (page - 1) * limit;

  const mQuery: any = { _id: { $ne: user._id } };
  if (query) {
    mQuery["name"] = { $regex: query, $options: "i" };
  }

  const [users, totalDocs] = await Promise.all([
    UserModel.find(mQuery)
      .sort({ updatedAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit),
    UserModel.countDocuments(mQuery),
  ]);
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;

  return ResponseHandler.success(
    {
      users: users || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalDocs,
        hasNextPage,
      },
    },
    "Users fetched!"
  );
}
