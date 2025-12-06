import { callApi } from "@/lib/api-client";
import { IUser } from "@/types/user.types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useGetUserQuery() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await callApi("/api/user/get-profile");
      return res?.data;
    },
  });
}

export function useGetUsersInfiniteQuery(enabled: boolean, query = "", limit = 10) {
  return useInfiniteQuery({
    queryKey: ["users", query],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await callApi(`/api/user/get-users?page=${pageParam}&limit=${limit}&query=${query}`);
      return res as unknown as any;
    },
    initialPageParam: 1,
    enabled,
    getNextPageParam: (lastPage) => {
      // If the API says there is a next page, increment the current page number
      if (lastPage.pagination?.hasNextPage) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined; // Returning undefined stops the fetcher
    },
    select(data) {
      return data.pages?.flatMap((d) => d.users) || [];
    },
  });
}

export function useGetUsersQuery(isEnabled: boolean, page: number, limit: number = 50, query: string = "") {
  return useQuery({
    queryKey: ["users", page, query],
    enabled: isEnabled,
    queryFn: async () => {
      return await callApi<IUser[]>(`/api/user/get-users?page=${page}&limit=${limit}&query=${query}`);
    },
    select(data: any) {
      return data?.users as IUser[];
    },
  });
}
