"use client";

import { Dialog } from "@/components/common/Dialog";
import TextInput from "@/components/common/TextInput";
import { useConversationContext } from "@/context/ConversatoinContext";
import { useCreateConversationMutation } from "@/react-query/conversation.react-query";
import { useGetUsersInfiniteQuery } from "@/react-query/user.react-query";
import { Loader } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ICreateConversationModalProps {
  open: boolean;
  onClose: () => void;
  type: "individual" | "group";
}

const CreateConversationModal: React.FC<ICreateConversationModalProps> = ({ open, onClose, type }) => {
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(inputValue);
      setCurrentUserPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const { data: allUsers, isFetching: isFetchingNextPage, hasNextPage, fetchNextPage } = useGetUsersInfiniteQuery(open, debouncedSearchQuery);

  const { mutate: createConversation, isPending: isCreatingConversation } = useCreateConversationMutation();
  const { setSelectedConversation } = useConversationContext();

  const isInitialLoading = isFetchingNextPage && !allUsers;

  const startConversation = useCallback(
    (participantId: string) => {
      createConversation(
        { participants: [participantId], type: type },
        {
          onSuccess: (response: any) => {
            if (response?.data) {
              setSelectedConversation(response?.data);
              onClose();
            }
          },
        }
      );
    },
    [type]
  );

  useEffect(() => {
    const el = observerTarget.current;

    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => {
      observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage]);

  return (
    <Dialog title="Create New Chat" open={open} onOpenChange={onClose} contentClassName="h-[500px]">
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="flex-none items-center p-2 pb-4 relative">
          <TextInput placeholder="Search users..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          {isFetchingNextPage && allUsers && (
            <div className="absolute right-4 top-4.5">
              <Loader className="w-4 h-4 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 border rounded-md border-transparent">
          {isInitialLoading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Loader className="animate-spin text-primary w-6 h-6" />
            </div>
          ) : (
            <div className="space-y-1">
              {allUsers?.length === 0 ? (
                <div className="flex h-full items-center justify-center pt-10 text-muted-foreground">
                  <p>No users found</p>
                </div>
              ) : (
                allUsers?.map((user) => (
                  <div
                    key={user._id}
                    className="p-3 hover:bg-accent rounded-md cursor-pointer transition-colors flex items-center gap-3"
                    onClick={() => startConversation(user._id)}
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-medium">{user.name}</p>
                  </div>
                ))
              )}

              <div ref={observerTarget} className="h-8 flex items-center justify-center w-full min-h-5">
                {isFetchingNextPage && <Loader className="w-5 h-5 animate-spin text-muted-foreground" />}
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default CreateConversationModal;
