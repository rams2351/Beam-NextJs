"use client";

import { IMessage } from "@/types/message.types";
import { IUser } from "@/types/user.types";
import { formatDate } from "@/utils/client-utils";
import Image from "next/image";
import React from "react";

interface MessageBubbleProps {
  message: IMessage;
  currentUserId: string;
  isGroup?: boolean; // If true, we show the sender's name in the bubble
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUserId, isGroup = false }) => {
  // ------------------------------------------
  // 1. Handle System Messages (Prompts)
  // ------------------------------------------
  if (message.type === "system") {
    return (
      <div className="flex w-full justify-center my-4">
        <span className="bg-muted/50 text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">{message.content}</span>
      </div>
    );
  }

  // ------------------------------------------
  // 2. Handle Normal Messages
  // ------------------------------------------
  // Ensure senderId is treated as a populated User object for display
  const sender = message.senderId as IUser;
  const isMe = sender?._id === currentUserId;

  return (
    <div className={`flex w-full gap-2 mb-4 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar (Only show for others) */}
      {!isMe && (
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
          {sender?.avatar ? (
            <Image src={sender.avatar} alt={sender.name} width={32} height={32} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground">
              {sender?.name?.[0] || "?"}
            </div>
          )}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`relative max-w-[70%] px-4 py-2 shadow-sm ${
          isMe
            ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground" // My Bubble (Orange)
            : "rounded-2xl rounded-tl-sm bg-secondary text-foreground" // Other Bubble (Gray)
        }`}
      >
        {/* Group Chat: Show Sender Name */}
        {!isMe && isGroup && <p className="mb-1 text-[10px] font-bold text-primary opacity-80">{sender?.name}</p>}

        {/* Message Content */}
        <p className="whitespace-pre-wrap text-sm leading-relaxed wrap-break-word">{message.content}</p>

        {/* Timestamp */}
        <div className={`mt-1 flex items-center justify-end text-[10px] ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {formatDate(new Date(message.createdAt), "h:mm a")}

          {/* Optional: Read Checks for 'Me' */}
          {isMe && (
            <span className="ml-1">
              {/* SVG for Double Check (Read) */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
