"use client";
import Button from "@/components/common/Button";
import Popover from "@/components/common/Popover";
import TextInput from "@/components/common/TextInput";
import ConversationParticipantList from "@/components/conversation/ConversationParticipantList";
import CreateConversationModal from "@/components/conversation/CreateConversationModal";
import { CirclePlus } from "lucide-react";
import React, { useCallback, useState } from "react";

type ChatType = "individual" | "group";
const ConversationLeftSidebar: React.FC = () => {
  const [isNewConvModalOpen, setIsNewConvModalOpen] = useState(false);
  const [conversationType, setConversationType] = useState<ChatType>("individual");

  const handleCloseNewConvModal = useCallback(() => {
    setIsNewConvModalOpen(false);
  }, []);

  const handleOpenNewConvModal = useCallback((type: ChatType) => {
    setConversationType(type);
    setIsNewConvModalOpen(true);
  }, []);
  return (
    <div className="hidden md:flex w-[300px] flex-col border-r border-border h-full">
      {/* Sidebar Header (Search/Filter) */}
      <div className="h-16 border-b border-border flex  justify-between items-center px-4 font-bold">
        <p className="">Chats</p>

        <Popover
          trigger={
            <Button size="sm">
              <CirclePlus /> New
            </Button>
          }
          contentClassName="w-fit p-3"
          content={
            <div className="space-y-2 w-20 [&>p:hover]:bg-accent [&>p]:py-1 [&>p]:px-2 [&>p]:rounded-lg [&>p]:cursor-pointer">
              <p onClick={() => handleOpenNewConvModal("individual")}>Chat</p>
              <p onClick={() => handleOpenNewConvModal("group")}>Group</p>
            </div>
          }
          align="end"
          side="bottom"
          showArrow={false}
        />
      </div>

      <div className="p-2">
        <TextInput placeholder="Search chat or participant" />
      </div>

      {/* Sidebar List - SCROLLS INDEPENDENTLY */}
      <ConversationParticipantList />

      <CreateConversationModal open={isNewConvModalOpen} onClose={handleCloseNewConvModal} type={conversationType} />
    </div>
  );
};

export default ConversationLeftSidebar;
