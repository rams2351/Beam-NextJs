"use client";

import Button from "@/components/common/Button";
import ConversationChatInput from "@/components/conversation/ConversationChatInput";
import ConversatoinMessageList from "@/components/conversation/ConversatoinMessageList";
import { useConversationContext } from "@/context/ConversatoinContext";
import socketService from "@/lib/socket";
import { useSendMessageMutation } from "@/react-query/message.react-query";
import { useGetUserQuery } from "@/react-query/user.react-query";
import { useQueryClient } from "@tanstack/react-query";
import { MessageSquareDashed, MoreVertical, Phone, Video } from "lucide-react";
import React, { useMemo } from "react";

const CovnersationChatArea: React.FC = () => {
  const queryClient = useQueryClient();
  const { selectedConversation } = useConversationContext();
  const { data: currentUser } = useGetUserQuery();

  // Mutation Hook
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessageMutation();

  // 1. LOGIC: Determine Chat Title & Avatar
  const chatDetails = useMemo(() => {
    if (!selectedConversation) return null;

    if (selectedConversation.type === "group") {
      return {
        name: selectedConversation.groupName || "Unnamed Group",
        avatar: selectedConversation.groupAvatar,
        status: `${selectedConversation.participants.length} members`,
        isOnline: false,
      };
    }

    if (!currentUser?._id) return { name: "Loading...", avatar: null, status: "", isOnline: false };

    const otherParticipant = selectedConversation.participants.find((p) => p._id.toString() !== currentUser._id.toString());
    const displayUser = otherParticipant || selectedConversation.participants[0];

    return {
      name: displayUser?.name || "Unknown User",
      avatar: displayUser?.avatar,
      status: (displayUser as any)?.isOnline ? "Online" : "Offline",
      isOnline: (displayUser as any)?.isOnline || false,
    };
  }, [selectedConversation, currentUser]);

  // 2. Handler for Sending
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      // 1. API Call (Saves to DB)
      // Ensure your mutation returns the ACTUAL message object (unwrapped)
      const response = await sendMessage({
        conversationId: selectedConversation._id,
        content: content,
        type: "text",
      });

      // NOTE: Adjust this based on your API response structure.
      // If controller returns { success: true, data: message }, retrieve .data
      // If your callApi wrapper already returns .data, then just use response.
      const newMessage = (response as any).data || response;

      // 2. EMIT TO SOCKET (So others see it)
      socketService.sendMessage(selectedConversation._id, newMessage);

      // 3. MANUAL CACHE UPDATE (So I see it instantly)
      queryClient.setQueryData<any>(["messages", selectedConversation._id], (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        const newPages = [...oldData.pages];
        const firstPage = { ...newPages[0] };

        // Prepend my new message
        firstPage.messages = [newMessage, ...firstPage.messages];
        newPages[0] = firstPage;

        return { ...oldData, pages: newPages };
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  // 3. EMPTY STATE
  if (!selectedConversation || !chatDetails) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-muted/10 text-muted-foreground gap-4">
        <div className="p-6 bg-background rounded-full shadow-sm">
          <MessageSquareDashed size={48} className="text-primary/60" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-lg text-foreground">No Chat Selected</h3>
          <p className="text-sm">Select a conversation to start messaging.</p>
        </div>
      </div>
    );
  }

  // 4. MAIN RENDER
  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      {/* A. HEADER */}
      <div className="h-16 border-b border-border flex justify-between items-center px-4 bg-background/95 backdrop-blur z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
            {chatDetails.avatar ? (
              <img src={chatDetails.avatar} alt={chatDetails.name} className="h-full w-full object-cover" />
            ) : (
              <span>{chatDetails.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{chatDetails.name}</span>
            <div className="flex items-center gap-1.5">
              {chatDetails.isOnline && <span className="w-2 h-2 rounded-full bg-green-500 block"></span>}
              <span className="text-xs text-muted-foreground">{chatDetails.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Button variant="ghost" size="icon">
            {" "}
            <Phone size={20} />{" "}
          </Button>
          <Button variant="ghost" size="icon">
            {" "}
            <Video size={20} />{" "}
          </Button>
          <Button variant="ghost" size="icon">
            {" "}
            <MoreVertical size={20} />{" "}
          </Button>
        </div>
      </div>

      {/* B. MESSAGE LIST (Separated Component) */}
      <ConversatoinMessageList chatDetails={chatDetails} />

      {/* C. INPUT AREA (Updated Component) */}
      <ConversationChatInput conversationId={selectedConversation._id} onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
};

export default CovnersationChatArea;
