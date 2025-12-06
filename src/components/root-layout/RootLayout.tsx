"use client";
import { Toaster } from "@/components/shadcn/sonner";
import { getQueryClient } from "@/lib/react-query";
import Loading from "@/services/LoadingService";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useEffect } from "react";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = getQueryClient();
  useEffect(() => {
    Loading.hideLoading();
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="loading-container">
        <div className="loader"></div>
      </div>
      <Toaster richColors />
      <QueryClientProvider client={queryClient}>
        <main className="flex flex-column min-h-screen max-w-screen bg-gray-100 dark:bg-gray-900">{children}</main>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NextThemesProvider>
  );
};

export default RootLayout;
