"use client";

import Dialog from "@/components/common/Dialog";
import { useLogoutMutation } from "@/react-query/auth.react-query";
import { cn } from "@/utils/client-utils";
import { LayoutDashboard, LogOut, MessageCircleIcon, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Button from "../common/Button";
import Switch from "../common/Switch";

const PrivateLayoutHeader: React.FC = () => {
  const pathname = usePathname();
  const { mutate: logout, isPending } = useLogoutMutation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/chat",
      label: "Chat",
      icon: MessageCircleIcon,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  const isDarkTheme = theme === "dark";

  const handleThemeChange = (isChecked: boolean) => {
    setTheme(isChecked ? "dark" : "light");
  };

  const handleCloseLogoutDialog = useCallback(() => {
    setIsLogoutDialogOpen(false);
  }, []);

  const handleOpenLogoutModal = useCallback(() => {
    setIsLogoutDialogOpen(true);
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur flex justify-between items-center px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="xbg-muted rounded-full" />
          <Image src={"/images/beam-white-text.svg"} alt="Beam-logo" className="object-contain h-8 w-auto" priority width={100} height={0} />
        </div>
        <div className="w-[50px] h-6" />
      </div>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
        {/* Left Side: Logo & Nav */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-foreground">
            <Image
              src={isDarkTheme ? "/images/beam-white-text.svg" : "/images/beam.svg"}
              alt="Beam-logo"
              className="object-contain h-8 w-auto"
              priority
              width={100}
              height={0}
            />
          </Link>

          <nav className="flex items-center gap-1 sm:gap-4 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <route.icon className="h-4 w-4" />
                <span className="hidden md:inline-block">{route.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: User Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch id="theme-mode" checked={isDarkTheme} onCheckedChange={handleThemeChange} aria-label="Toggle Dark Mode" />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenLogoutModal}
            disabled={isPending}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            isLoading={isPending}
          >
            {!isPending && <LogOut className="mr-2 h-4 w-4" />}
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      <Dialog
        title="Create New Chat"
        open={isLogoutDialogOpen}
        onOpenChange={handleCloseLogoutDialog}
        closeLabel="Cancel"
        actionLabel="Logout"
        isDestructive
        onAction={logout}
        isLoading={isPending}
      >
        <div className="">
          <p className="">Are you sure want to logout from the Beam Chat App.</p>
        </div>
      </Dialog>
    </header>
  );
};

export default PrivateLayoutHeader;
