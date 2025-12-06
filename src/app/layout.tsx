import "@/app/styles/main.css";
import RootLayout from "@/components/root-layout/RootLayout";
import { Metadata } from "next";
import localFont from "next/font/local";

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

// 1. Define the Base Metadata here
export const metadata: Metadata = {
  title: {
    // %s will be replaced by the title exported in child pages
    template: "%s | Beam",
    default: "Beam | Real-time Chat", // Fallback if a page doesn't have a title
  },
  description: "Connect instantly with the world on Beam.",
  applicationName: "Beam",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${roboto.variable}`} lang="en" suppressHydrationWarning>
      <body className={` antialiased`}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
