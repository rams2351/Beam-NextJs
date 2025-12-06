"use client";

import socketService from "@/lib/socket";
import { useGetConversationsInfiniteQuery } from "@/react-query/conversation.react-query";
import { IConversation } from "@/types/conversation.types";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ContextProviderProps {
  token: string | null;
  children: React.ReactNode;
}

interface IConversationContext {
  conversations: IConversation[];
  selectedConversation: IConversation | null;

  // Loading States
  isLoadingInitial: boolean; // Initial load (page 1)
  isFetchingNextPage: boolean; // Loading more (page 2+)

  // Pagination Controls
  fetchNextPage: () => void;
  hasNextPage: boolean;

  // Actions
  setConversations: React.Dispatch<React.SetStateAction<IConversation[]>>;
  setSelectedConversation: (conv: IConversation | null) => void;
  updateConversationInList: (updatedConv: IConversation) => void;
}

const ConversationContext = createContext<IConversationContext | undefined>(undefined);

export const ConversationProvider: React.FC<ContextProviderProps> = ({ children, token }) => {
  // 1. USE INFINITE QUERY HOOK
  const { data: infiniteData, isLoading: isLoadingInitial, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetConversationsInfiniteQuery();

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);

  // 2. SYNC REACT QUERY DATA TO LOCAL STATE
  // We flatten the pages (Page 1, Page 2...) into a single array whenever data changes.
  useEffect(() => {
    if (infiniteData) {
      const flatList = infiniteData.pages.flatMap((page) => page.data);

      setConversations(flatList);
      // if (selectedConversation) updateConversationInList(selectedConversation);
    }
  }, [infiniteData, selectedConversation]);

  // 3. HELPER: Manually update list (e.g., move chat to top)
  const updateConversationInList = (updatedConv: IConversation) => {
    setConversations((prev) => {
      // Remove the old version of this chat
      const filtered = prev.filter((c) => c._id !== updatedConv._id);
      // Add the updated version to the TOP
      return [updatedConv, ...filtered];
    });
  };

  // 4. SOCKET LOGIC
  useEffect(() => {
    if (token) {
      console.log("⚡ Server provided token, initializing socket listeners...");
      socketService.connect(token); // Ensure your socket connects elsewhere or here
    }
  }, [token]);

  const value = useMemo(
    () => ({
      conversations,
      selectedConversation,
      isLoadingInitial,
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
      setConversations,
      setSelectedConversation,
      updateConversationInList,
    }),
    [conversations, selectedConversation, isLoadingInitial, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
};

export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversationContext must be used within a ConversationProvider");
  }
  return context;
};
