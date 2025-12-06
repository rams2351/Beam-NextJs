import { IMessage } from "@/types/message.types";
import mongoose, { Document, Model, Schema } from "mongoose";

interface IMessageDocument extends Omit<IMessage, "_id" | "conversationId">, Document {
  conversationId: Schema.Types.ObjectId;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required is false because system messages might not have a specific sender
    },
    content: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
    },
    attachments: [
      {
        url: String,
        fileType: String,
        fileName: String,
      },
    ],
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// ⚡ PERFORMANCE INDEX
// This allows: Message.find({ conversationId: "..." }).sort({ createdAt: -1 })
// This makes loading the chat history for a specific room extremely fast.
MessageSchema.index({ conversationId: 1, createdAt: -1 });

const MessageModel: Model<IMessageDocument> = mongoose.models.Message || mongoose.model<IMessageDocument>("Message", MessageSchema);

export default MessageModel;
