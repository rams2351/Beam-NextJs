"use client";
import ConversationParticipantListItem from "@/components/conversation/ConversationParticipantListItem";
import { useConversationContext } from "@/context/ConversatoinContext";
import { Info, Loader } from "lucide-react";
import React, { useEffect, useRef } from "react";

const ConversationParticipantList: React.FC = () => {
  const { conversations, isLoadingInitial, isFetchingNextPage, fetchNextPage, hasNextPage } = useConversationContext();

  // 1. Ref for the SCROLL CONTAINER (The parent that has overflow-y-auto)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 2. Ref for the SENTINEL (The element at the bottom)
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = observerTarget.current;
    const scrollContainer = scrollContainerRef.current;

    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log("⬇️ Load more triggered");
          fetchNextPage();
        }
      },
      {
        root: scrollContainer,
        threshold: 0.1,
      }
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, isLoadingInitial, conversations?.length]);

  return (
    // 4. Attach the scrollContainerRef here
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-2 space-y-2">
      {isLoadingInitial ? (
        <div className="p-4 text-sm text-muted-foreground flex items-center gap-2 justify-center mt-10">
          <Loader className="animate-spin text-primary" />
          Loading chats...
        </div>
      ) : (
        <div className="">
          {!!conversations?.length ? (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <ConversationParticipantListItem key={conv._id} {...conv} />
              ))}

              <div ref={observerTarget} className="h-8 flex items-center justify-center w-full min-h-5">
                {isFetchingNextPage && <Loader className="w-5 h-5 animate-spin text-muted-foreground" />}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-center h-full flex-col text-muted-foreground pt-10">
              <Info className="h-6 w-6 mb-2" />
              <p className="font-medium">No Conversations available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationParticipantList;
