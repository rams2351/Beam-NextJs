"use client";

import Button from "@/components/common/Button";
import socketService from "@/lib/socket";
import { Loader2, Paperclip, Send } from "lucide-react";
import React, { useRef, useState } from "react";

interface ChatInputProps {
  conversationId: string;
  onSendMessage: (content: string) => Promise<void>;
  isSending: boolean;
}

export default function ConversationChatInput({ conversationId, onSendMessage, isSending }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    socketService.sendTyping(conversationId);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendStopTyping(conversationId);
    }, 2000);
  };

  // 🛠️ FIX: Create a handler for the form submission
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault(); // 1. Prevent Page Refresh

    if (!message.trim() || isSending) return;

    // 2. Stop Typing status immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketService.sendStopTyping(conversationId);

    const content = message;
    setMessage(""); // 3. Optimistic Clear UI

    // 4. Call parent with the STRING content, not the event
    await onSendMessage(content);
  };

  return (
    <div className="border-t border-border bg-background p-4">
      {/* 🛠️ FIX: Pass the local handler, not the prop directly */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Paperclip size={20} />
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="w-full rounded-full border border-input bg-secondary/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <Button type="submit" disabled={!message.trim() || isSending} className="rounded-full px-4 h-10 w-10 p-0 flex items-center justify-center">
          {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
        </Button>
      </form>
    </div>
  );
}
