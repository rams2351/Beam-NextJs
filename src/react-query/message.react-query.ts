import { callApi } from "@/lib/api-client";
import { FetchMessagesResponse } from "@/types/api.types";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch Messages (Infinite Scroll)
export function useGetMessagesQuery(conversationId: string) {
  return useInfiniteQuery<FetchMessagesResponse>({
    queryKey: ["messages", conversationId],

    // 1. Explicitly type pageParam
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      const page = pageParam as number;

      // 2. Use 'any' for the generic to bypass the incorrect 'data' nesting definition
      // 3. Cast the result to 'FetchMessagesResponse' which matches the runtime JSON
      const response = await callApi<any>(`/api/messages/getConversationMessages/${conversationId}?page=${page}&limit=15`);

      if (!response) {
        throw new Error("Failed to fetch messages");
      }

      return response as unknown as FetchMessagesResponse;
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      // Access meta directly (since it's at the root of FetchMessagesResponse)
      return lastPage.meta.hasMore ? lastPage.meta.nextPage : undefined;
    },

    enabled: !!conversationId,
  });
}

// Send Message Mutation
export function useSendMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content, type = "text" }: any) => {
      return await callApi("/api/messages/createConversationMessages", {
        method: "POST",
        body: { conversationId, content, type },
      });
    },
    // Optional: Update cache or wait for socket event
  });
}
