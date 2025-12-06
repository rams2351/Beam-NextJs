import ConversationModel from "@/database/models/conversation.model";
import { ResponseHandler } from "@/lib/api-server";
import { IUser } from "@/types/user.types";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

// ----------------------------------------------------------------------
// 1. CREATE CONVERSATION (No changes needed here)
// ----------------------------------------------------------------------
export async function createConversationController(req: NextRequest, _context: any, user: IUser) {
  const body = await req.json();

  const { participants, type, groupName, groupAvatar, admins } = body;

  // Handle Group Chat Creation
  if (type === "group") {
    if (!groupName) return ResponseHandler.error("Group name is required!");

    const newConversation = await ConversationModel.create({
      type: "group",
      participants: [...participants, user._id],
      admins: [user._id, ...(admins || [])],
      groupName,
      groupAvatar,
      unreadCounts: {},
    });

    // Populate immediately so UI can render it
    await newConversation.populate("participants", "name avatar email");

    return ResponseHandler.success({ data: newConversation }, "Group created");
  }

  const otherUserId = participants[0];

  if (!otherUserId) return ResponseHandler.error("Participant required");

  // Check if a DM already exists
  const existingConv = await ConversationModel.findOne({
    type: "individual",
    participants: { $all: [user._id, otherUserId] },
  }).populate("participants", "name avatar email isOnline");

  if (existingConv) {
    return ResponseHandler.success({ data: existingConv }, "Conversation exists");
  }

  // Create new DM
  const newConversation = await ConversationModel.create({
    type: "individual",
    participants: [user._id, otherUserId],
    unreadCounts: {
      [user._id.toString()]: 0,
      [otherUserId]: 0,
    },
  });

  await newConversation.populate("participants", "name avatar email isOnline");

  return ResponseHandler.success({ data: newConversation }, "Chat started");
}

// ----------------------------------------------------------------------
// 2. GET USER CONVERSATIONS (Updated for Pagination)
// ----------------------------------------------------------------------
export async function getUserConversatonController(req: NextRequest, context: any, user: IUser) {
  // 1. Extract Page & Limit from URL Query Params
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const query = { participants: new Types.ObjectId(user._id) };

  // 2. Run Query & Count in Parallel (Optimization)
  const [conversations, totalDocs] = await Promise.all([
    ConversationModel.find(query)
      .sort({ updatedAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate("participants", "name avatar email isOnline")
      .populate("lastMessage.senderId", "name")
      .lean(), // .lean() makes it a plain JS object (faster)

    ConversationModel.countDocuments(query),
  ]);

  // 3. Calculate Pagination Meta
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;

  // 4. Return Structured Response matches your Frontend Types
  return ResponseHandler.success(
    {
      data: conversations || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalDocs,
        hasNextPage,
      },
    },
    "Conversations fetched successfully!"
  );
}
