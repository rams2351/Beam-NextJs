"use client";

import socketService from "@/lib/socket";
import React, { useEffect } from "react";

interface SocketProviderProps {
  token: string | null;
  children: React.ReactNode;
}

export default function SocketProvider({ token, children }: SocketProviderProps) {
  useEffect(() => {
    if (token) {
      console.log("⚡ Server provided token, connecting socket...");
      // socketService.connect(token);
    }

    // Cleanup on unmount
    return () => {
      if (token) {
        socketService.disconnect();
      }
    };
  }, [token]);

  return <>{children}</>;
}
