import { callApi } from "@/lib/api-client";
import { IConversation } from "@/types/conversation.types";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --------------------------------------------------------
// 1. TYPES (Input/Output Interfaces)
// --------------------------------------------------------

interface CreateConversationBody {
  type: "individual" | "group";
  participants: string[]; // Array of User IDs (excluding self)

  // Group Specific
  groupName?: string;
  groupAvatar?: string;
  admins?: string[];
}

// Helper for Pagination Data
interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  hasNextPage: boolean;
}

// Updated Response to include Data + Pagination Info
interface GetConversationsResponse {
  data: IConversation[];
  pagination: PaginationMeta;
}

interface CreateConversationResponse {
  conversation: IConversation;
}

// --------------------------------------------------------
// 2. QUERY: Fetch My Conversations (Infinite Scroll)
// --------------------------------------------------------
export function useGetConversationsInfiniteQuery() {
  return useInfiniteQuery<GetConversationsResponse>({
    queryKey: ["conversations"], // Keep this key simple so mutations can invalidate it easily
    initialPageParam: 1,

    // The queryFn now receives 'pageParam' automatically
    queryFn: async ({ pageParam = 1 }) => {
      // We pass page & limit to the backend
      const response = await callApi<GetConversationsResponse>(`/api/conversation/getConversation?page=${pageParam}&limit=10`);

      // Return the whole object (data + pagination) so getNextPageParam can use it
      return response as unknown as GetConversationsResponse;
    },

    // Logic to calculate the next page number
    getNextPageParam: (lastPage) => {
      // If the API says there is a next page, increment the current page number
      if (lastPage.pagination?.hasNextPage) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined; // Returning undefined stops the fetcher
    },

    // Optimization: Keep data fresh for 1 minute
    staleTime: 60 * 1000,
  });
}

// --------------------------------------------------------
// 3. MUTATION: Create New Conversation (DM or Group)
// --------------------------------------------------------
export function useCreateConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateConversationBody) => {
      // Calls: POST /api/conversation/createConversation
      return await callApi<CreateConversationResponse>("/api/conversation/createConversation", {
        method: "POST",
        body,
      });
    },
    onSuccess: () => {
      // ⚡ REFETCH
      // Invalidating ["conversations"] will reset the infinite list to Page 1
      // and fetch the newest data (including the new chat).
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
