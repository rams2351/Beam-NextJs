import { showErrorMsg } from "@/utils/client-utils";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}

type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestOptions<TBody = any> {
  method?: ApiMethod;
  body?: TBody;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export async function callApi<TData = any, TBody = any>(
  endpoint: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<ApiResponse<TData> | null> {
  const method = options.method || "GET";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(endpoint, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.next,
  });

  const data = await res.json().catch(() => ({}));

  // ==========================================================
  // SIMPLIFIED AUTH HANDLING
  // ==========================================================
  // If we get a 401 here, it means the Server Wrapper TRIED to
  // refresh the token but FAILED (e.g., Refresh token expired).
  // Therefore, there is no point in retrying. We must Log Out.
  if (res.status === 401) {
    await handleLogout();
    showErrorMsg("Session expired. Please login again.");
    throw new Error("Session expired. Please login again.");
  }

  // Handle API Logical Errors (Success: false)
  if (!res.ok || data.success === false) {
    const errorMessage = data.message || "Something went wrong";
    showErrorMsg(errorMessage);
    throw new Error(errorMessage);
  }

  return data as ApiResponse<TData>;
}

async function handleLogout() {
  try {
    // Notify server to delete cookies/tokens from DB
    await fetch("/api/auth/logout", { method: "POST" }).then(() => {
      window.location.href = "/login";
    });
  } catch (e) {
    console.error("Logout API failed", e);
  }
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
