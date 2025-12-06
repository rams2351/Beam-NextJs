import socketService from "@/lib/socket";
import { useGetUserQuery } from "@/react-query/user.react-query";
import { IMessage } from "@/types/message.types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useSocketChat(conversationId: string) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useGetUserQuery(); // We need to know who "I" am
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string>("");

  useEffect(() => {
    if (!conversationId) return;

    // 1. Join the Room explicitly
    console.log(`🔌 Joining Room: ${conversationId}`);
    socketService.joinRoom(conversationId);

    // 2. Define Handler
    const handleReceiveMessage = (newMessage: IMessage) => {
      console.log("📩 Socket received:", newMessage);

      // A. Safety Checks
      if (newMessage.conversationId !== conversationId) return;

      // B. DUPLICATE PREVENTION:
      // If I sent this message, my UI already updated manually in ChatArea.
      // So ignore it here to prevent duplicates.
      const senderId = typeof newMessage.senderId === "object" ? (newMessage.senderId as any)._id : newMessage.senderId;

      if (senderId === currentUser?._id) {
        return;
      }

      // C. Update React Query Cache (The hard part)
      queryClient.setQueryData<any>(["messages", conversationId], (oldData: any) => {
        // If no data exists yet, we can't really "add" to it easily without structure.
        // Better to invalidate to force a fetch.
        if (!oldData || !oldData.pages) {
          queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
          return oldData;
        }

        // Clone the existing data structure
        const newPages = [...oldData.pages];
        const firstPage = { ...newPages[0] };

        // Add new message to the TOP of the first page
        firstPage.messages = [newMessage, ...firstPage.messages];

        // Update the first page in the array
        newPages[0] = firstPage;

        return {
          ...oldData,
          pages: newPages,
        };
      });
    };

    const handleTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId && data.userId !== currentUser?._id) {
        setIsTyping(true);
        setTypingUser(data.userId);
      }
    };

    const handleStopTyping = (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setIsTyping(false);
        setTypingUser("");
      }
    };

    // 3. Attach Listeners
    socketService.on("receive_message", handleReceiveMessage);
    socketService.on("user_typing", handleTyping);
    socketService.on("user_stop_typing", handleStopTyping);

    // 4. Cleanup
    return () => {
      socketService.leaveRoom(conversationId);
      socketService.off("receive_message");
      socketService.off("user_typing");
      socketService.off("user_stop_typing");
    };
  }, [conversationId, queryClient, currentUser]);

  return { isTyping, typingUser };
}
