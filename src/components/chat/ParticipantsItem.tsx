"use client";

import { IConversation } from "@/types/conversation.types";
import { formatDate } from "@/utils/client-utils";
import Image from "next/image";
import React, { useMemo } from "react";

interface ConversationItemProps {
  conversation: IConversation;
  currentUserId: string;
  isActive?: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, currentUserId, isActive = false, onClick }) => {
  // 1. Derived Logic: Determine Name and Avatar
  const displayDetails = useMemo(() => {
    if (conversation.type === "group") {
      return {
        name: conversation.groupName || "Unnamed Group",
        avatar: conversation.groupAvatar,
        fallback: (conversation.groupName || "G")[0].toUpperCase(),
      };
    }

    // It's a DM: Find the participant that is NOT me
    const otherUser = conversation.participants.find((p) => p._id !== currentUserId);

    return {
      name: otherUser?.name || "Unknown User",
      avatar: otherUser?.avatar,
      fallback: (otherUser?.name || "U")[0].toUpperCase(),
      isOnline: otherUser?.isOnline,
    };
  }, [conversation, currentUserId]);

  // 2. Unread Count for ME
  const unreadCount = conversation.unreadCounts?.[currentUserId] || 0;

  return (
    <div
      onClick={onClick}
      className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 transition-all
        ${
          isActive
            ? "bg-primary/10 dark:bg-primary/20" // Active State
            : "hover:bg-secondary/80" // Hover State
        }`}
    >
      {/* Avatar Section */}
      <div className="relative">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-muted shadow-sm">
          {displayDetails.avatar ? (
            <Image src={displayDetails.avatar} alt={displayDetails.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-secondary to-muted text-foreground font-bold">
              {displayDetails.fallback}
            </div>
          )}
        </div>
        {/* Online Dot (Only for DMs) */}
        {displayDetails.isOnline && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col overflow-hidden text-left">
        <div className="flex justify-between items-center">
          <h4 className={`truncate text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>{displayDetails.name}</h4>
          {/* Time */}
          {conversation.lastMessage && (
            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{formatDate(new Date(conversation.updatedAt), "h:mm a")}</span>
          )}
        </div>

        <div className="flex justify-between items-center mt-1">
          <p className="truncate text-xs text-muted-foreground w-full pr-2">
            {conversation.lastMessage ? (
              // Check if I sent the last message
              conversation.lastMessage.senderId === currentUserId ? (
                `You: ${conversation.lastMessage.content}`
              ) : (
                conversation.lastMessage.content
              )
            ) : (
              <span className="italic opacity-50">No messages yet</span>
            )}
          </p>

          {/* Unread Badge (Beam Orange) */}
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground animate-in zoom-in">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
