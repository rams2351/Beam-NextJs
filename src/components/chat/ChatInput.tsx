"use client";

import Button from "@/components/common/Button";
import socketService from "@/lib/socket";
import { Loader2, Paperclip, Send } from "lucide-react";
import React, { useRef, useState } from "react";

interface ChatInputProps {
  conversationId: string;
  onSendMessage: (content: string) => Promise<void>; // Passed from parent
  isSending: boolean;
}

export default function ChatInput({ conversationId, onSendMessage, isSending }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Handle Typing Events (Debounced)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // Emit "Typing..." event
    socketService.sendTyping(conversationId);

    // Clear previous timer
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Stop typing event after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendStopTyping(conversationId);
    }, 2000);
  };

  // 2. Handle Send
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isSending) return;

    // Stop typing immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketService.sendStopTyping(conversationId);

    const content = message;
    setMessage(""); // Clear UI immediately (Optimistic feel)

    await onSendMessage(content);
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <form onSubmit={handleSend} className="flex items-center gap-2">
        {/* Attachment Button (Visual only for now) */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Paperclip size={20} />
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="w-full rounded-full border border-input bg-secondary/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Send Button */}
        <Button type="submit" disabled={!message.trim() || isSending} className="rounded-full px-4 h-10 w-10 p-0 flex items-center justify-center">
          {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
        </Button>
      </form>
    </div>
  );
}
