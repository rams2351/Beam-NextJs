import ConversationModel from "@/database/models/conversation.model";
import MessageModel from "@/database/models/message.model";
import { ResponseHandler } from "@/lib/api-server";
import { NextRequest } from "next/server";

type RouteContext = { params: Promise<{ conversationId: string }> };

export async function getConversationMessagesController(req: NextRequest, context: RouteContext, user: any) {
  const { conversationId } = await context.params;

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "15", 10);
  const skip = (page - 1) * limit;

  const [messages, totalMessages] = await Promise.all([
    MessageModel.find({
      conversationId: conversationId as any,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "name email image")
      .lean(),

    MessageModel.countDocuments({
      // FIX: Same here
      conversationId: conversationId as any,
    }),
  ]);

  const totalPages = Math.ceil(totalMessages / limit);
  const hasMore = page < totalPages;

  return ResponseHandler.success(
    {
      messages,
      meta: {
        total: totalMessages,
        page,
        limit,
        totalPages,
        hasMore,
        nextPage: hasMore ? page + 1 : null,
      },
    },
    "Messages fetched successfully"
  );
}

export async function createMessageController(req: NextRequest, context: any, user: any) {
  // 1. Parse Body
  const body = await req.json();
  const { conversationId, content, type = "text", attachments } = body;

  // 2. Validate
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  // Determine snippet content for the conversation list
  // If sending an image, we don't want the last message to be empty string
  let lastMessageContent = content;
  if (type === "image") lastMessageContent = "📷 Image";
  else if (type === "file") lastMessageContent = "📎 File";

  if (type === "text" && (!content || !content.trim())) {
    throw new Error("Message content cannot be empty");
  }

  // 3. Create Message
  const newMessage = await MessageModel.create({
    conversationId,
    senderId: user._id,
    content,
    type,
    attachments: attachments || [],
    readBy: [user._id],
  });

  await newMessage.populate("senderId", "name email avatar");

  // 5. Update Conversation (Complex Update)
  // We fetch the document to handle the Map logic for unreadCounts safely
  const conversation = await ConversationModel.findById(conversationId);

  if (conversation) {
    // A. Update Last Message (Embedded)
    conversation.lastMessage = {
      content: lastMessageContent,
      senderId: user._id,
      createdAt: new Date(),
      isSystem: false,
    };

    // B. Handle Unread Counts
    // We iterate through all participants.
    // If the participant is NOT the sender, we increment their unread count.
    conversation.participants.forEach((participantId) => {
      const pIdStr = participantId.toString();
      const senderIdStr = user._id.toString();

      if (pIdStr !== senderIdStr) {
        // Get current count (default to 0 if undefined)
        const currentCount = conversation.unreadCounts.get(pIdStr) || 0;
        conversation.unreadCounts.set(pIdStr, currentCount + 1);
      }
    });

    // C. Save updates
    await conversation.save();
  }

  // 6. Return Response
  return ResponseHandler.success({ data: newMessage.toObject() }, "Message sent successfully");
}
