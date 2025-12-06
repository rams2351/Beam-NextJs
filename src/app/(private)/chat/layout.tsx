import { ConversationProvider } from "@/context/ConversatoinContext";
import { getValidAccessToken } from "@/lib/jwt";
import React from "react";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  // ✅ This will now return a valid token even if the cookie was expired
  const token = await getValidAccessToken();

  return (
    <ConversationProvider token={token}>
      <div className="flex h-full w-full overflow-hidden bg-background rounded-2xl border border-border">{children}</div>
    </ConversationProvider>
  );
}
