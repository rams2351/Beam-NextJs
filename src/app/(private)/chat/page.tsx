import ConversationLeftSidebar from "@/components/conversation/ConversationLeftSidebar";
import CovnersationChatArea from "@/components/conversation/CovnersationChatArea";
import React from "react";

const ChatPage: React.FC = () => {
  return (
    // PARENT: Fixed height, NO scroll here (overflow-hidden)
    <div className="flex w-full h-[calc(100vh-125px)] overflow-hidden bg-background ">
      {/* 1. LEFT SIDEBAR (Conversation List) */}
      <ConversationLeftSidebar />

      {/* 2. MAIN CHAT AREA (Right Side) */}
      <CovnersationChatArea />
    </div>
  );
};

export default ChatPage;
