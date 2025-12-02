import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";

// 1. Create a function to generate the client
// We do this to ensure we don't share clients between requests on the Server
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 1 minute (no refetching)
        staleTime: 60 * 1000,
        // Retry failed requests 1 time
        retry: 1,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Include pending queries in dehydration
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

// 2. Singleton pattern for Browser
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new client
    return makeQueryClient();
  } else {
    // Browser: make a new client if we don't have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
