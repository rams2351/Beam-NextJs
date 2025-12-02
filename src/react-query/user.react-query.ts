import { callApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export function useGetUserQuery() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await callApi("/api/user/get-profile");
    },
  });
}
