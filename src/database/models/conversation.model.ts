import { IConversation } from "@/types/conversation.types";
import mongoose, { Document, Model, Schema } from "mongoose";

// We extend Document to get Mongoose methods, but omit the 'participants'
// from IConversation because in the DB they are ObjectIds, not full Users.
interface IConversationDocument extends Omit<IConversation, "_id" | "participants" | "unreadCounts">, Document {
  participants: mongoose.Types.ObjectId[];
  unreadCounts: mongoose.Types.Map<number>;
}

const ConversationSchema = new Schema<IConversationDocument>(
  {
    type: {
      type: String,
      enum: ["individual", "group"],
      default: "individual",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupName: { type: String }, // Only for type: 'group'
    groupAvatar: { type: String },
    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // ⚡ PERFORMANCE: Embedded Last Message
    lastMessage: {
      content: { type: String },
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date },
      isSystem: { type: Boolean, default: false },
    },

    // Unread counts per user
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// ⚡ INDEX: Critical for fetching "My Conversations" sorted by newest first
ConversationSchema.index({ participants: 1, updatedAt: -1 });

const ConversationModel: Model<IConversationDocument> =
  mongoose.models.Conversation || mongoose.model<IConversationDocument>("Conversation", ConversationSchema);

export default ConversationModel;
