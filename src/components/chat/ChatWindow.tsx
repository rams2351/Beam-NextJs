"use client";

import { MessageBubble } from "@/components/chat/ChatBubble";
import socketService from "@/lib/socket";
import { useGetMessagesQuery, useSendMessageMutation } from "@/react-query/message.react-query";
import { IMessage } from "@/types/message.types";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
}

export default function ChatWindow({ conversationId, currentUserId }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch History
  const { data: response, isLoading } = useGetMessagesQuery(conversationId);
  const messagesHistory = response?.data || [];

  // 2. Local State for Real-time Messages (Appended to history)
  const [realtimeMessages, setRealtimeMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // 3. Send Mutation
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessageMutation();

  // 4. Auto-Scroll to Bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesHistory, realtimeMessages, isTyping]);

  // 5. SOCKET LISTENERS
  useEffect(() => {
    // Join the room
    socketService.joinRoom(conversationId);

    // Listen for incoming messages
    socketService.on<IMessage>("receive_message", (newMessage) => {
      // Avoid duplicates if we optimistically added it (check by ID if needed)
      setRealtimeMessages((prev) => [...prev, newMessage]);
    });

    // Listen for typing
    socketService.on("user_typing", () => setIsTyping(true));
    socketService.on("user_stop_typing", () => setIsTyping(false));

    return () => {
      socketService.leaveRoom(conversationId);
      socketService.off("receive_message");
      socketService.off("user_typing");
      socketService.off("user_stop_typing");
    };
  }, [conversationId]);

  // 6. Handle Send (The Bridge: UI -> API -> Socket)
  const handleSendMessage = async (content: string) => {
    try {
      // A. Save to Database
      const res = await sendMessage({ conversationId, content });

      if (res?.success) {
        const savedMessage = res.data;
        // B. Emit to Socket Server so OTHERS see it
        socketService.sendMessage(conversationId, savedMessage);
      }
    } catch (error) {
      console.error("Failed to send", error);
    }
  };

  // Combine History + Realtime
  // Note: ideally you'd de-duplicate here based on _id
  const allMessages = [...messagesHistory, ...realtimeMessages];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.map((msg, index) => (
          <MessageBubble
            key={msg._id || index}
            message={msg}
            currentUserId={currentUserId}
            isGroup={false} // You can pass this from props if needed
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-primary/50" />
            <div className="h-2 w-2 rounded-full bg-primary/50 delay-75" />
            <div className="h-2 w-2 rounded-full bg-primary/50 delay-150" />
            Someone is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput conversationId={conversationId} onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
}
