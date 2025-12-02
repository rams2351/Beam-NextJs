"use client";
import "@/app/styles/main.css";
import Metadata from "@/components/common/Metadata";
import { Toaster } from "@/components/shadcn/sonner";
import { getQueryClient } from "@/lib/react-query";
import Loading from "@/services/LoadingService";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import localFont from "next/font/local";
import { useEffect } from "react";

const roboto = localFont({
  src: [
    // 100 - Thin
    {
      path: "./fonts/Roboto-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Roboto-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    // 300 - Light
    {
      path: "./fonts/Roboto-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Roboto-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    // 400 - Regular
    {
      path: "./fonts/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Roboto-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    // 500 - Medium
    {
      path: "./fonts/Roboto-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Roboto-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    // 700 - Bold
    {
      path: "./fonts/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Roboto-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    // 900 - Black
    {
      path: "./fonts/Roboto-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Roboto-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    Loading.hideLoading();
  }, []);
  const queryClient = getQueryClient();

  return (
    <html className={`${roboto.variable}`} lang="en" suppressHydrationWarning>
      <body className={` antialiased`}>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="loading-container">
            <div className="loader"></div>
          </div>
          <Toaster richColors />
          <Metadata seoTitle={process.env.NEXT_PUBLIC_APP_NAME || "APP title"} seoDescription="App description" />
          <QueryClientProvider client={queryClient}>
            <main className="flex flex-column min-h-screen max-w-screen bg-gray-100 dark:bg-gray-900">{children}</main>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
