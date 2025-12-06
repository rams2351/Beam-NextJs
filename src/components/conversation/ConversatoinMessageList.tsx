"use client";

import { MessageBubble } from "@/components/chat/ChatBubble";
import { useConversationContext } from "@/context/ConversatoinContext";
import { useSocketChat } from "@/hooks/use-socket-chat";
import { useGetMessagesQuery } from "@/react-query/message.react-query";
import { useGetUserQuery } from "@/react-query/user.react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface MessageListProps {
  chatDetails: any;
}

export default function ConversatoinMessageList({ chatDetails }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedConversation } = useConversationContext();
  const conversationId = selectedConversation?._id || "";

  // 1. Fetch Data
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetMessagesQuery(conversationId);

  const { data: currentUser } = useGetUserQuery();

  const { isTyping } = useSocketChat(conversationId);

  // 2. Infinite Scroll Trigger (Sentinel)
  const { ref: topSentinelRef, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      // Save current scroll height to maintain position after fetch
      const container = scrollRef.current;
      if (container) {
        const currentHeight = container.scrollHeight;
        const currentTop = container.scrollTop;

        fetchNextPage().then(() => {
          // RESTORE SCROLL POSITION (Rough approximation)
          // In a real app, you often use useLayoutEffect for this
          // preventing the scroll bar from jumping to top
        });
      } else {
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 3. Process Messages
  // API returns [Newest, ..., Oldest] per page.
  // We flatten it to a single array: [Newest(p1), ..., Oldest(p1), Newest(p2)...]
  const messages = useMemo(() => {
    return data?.pages.flatMap((page) => page.messages) || [];
  }, [data]);

  // 4. Auto-Scroll to Bottom on Initial Load or New Message (sent by me)
  useEffect(() => {
    if (messages.length > 0 && !isFetchingNextPage) {
      // Simple logic: If we are near bottom, or it's first load, scroll down
      // For this example, we scroll down on initial load mostly
      const container = scrollRef.current;
      if (container && !hasNextPage) {
        // If we have no history (start of chat), snap to bottom
        // Or usually, you check if distance from bottom is small
        // container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages.length, hasNextPage]);

  // 5. Scroll to bottom Helper
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // Trigger scroll to bottom on mount/conversation change
  useEffect(() => {
    scrollToBottom();
  }, [conversationId, isLoading]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-muted/5 scroll-smooth flex flex-col-reverse">
      {/* FLEX-COL-REVERSE TRICK:
            We render the list in reverse order (Bottom to Top).
            This makes "scrolling to bottom" the default natural state of the browser,
            and "loading more" happens when we scroll UP (which is technically down in flex-reverse).
            
            This is the most robust way to build Chat UIs.
        */}

      {/* 1. Bottom Spacer */}
      <div className="h-2" />

      {isTyping && <div className="text-xs text-muted-foreground ml-4 mb-2 animate-pulse">{chatDetails?.name || "Someone"} is typing...</div>}
      {/* 2. Messages (Mapped) */}
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg._id || index}
          message={msg}
          currentUserId={currentUser?._id || ""}
          isGroup={false} // Pass dynamically if needed
        />
      ))}

      {/* 3. Loading Indicator (At the visual Top, which is the end of the list in reverse) */}
      {hasNextPage && (
        <div ref={topSentinelRef} className="flex justify-center py-4">
          {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </div>
      )}

      {!hasNextPage && messages.length > 0 && <div className="text-center text-xs text-muted-foreground my-4">Start of conversation</div>}
    </div>
  );
}
