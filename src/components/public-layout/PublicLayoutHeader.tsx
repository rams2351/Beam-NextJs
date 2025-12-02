"use client";

import { Bus, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import Switch from "../common/Switch";

const PublicLayoutHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border flex justify-between items-center px-4 h-16">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-muted rounded-full" />
          <span className="text-lg font-bold text-muted-foreground">My App</span>
        </div>
        <div className="w-[50px] h-6" />
      </div>
    );
  }

  const isDarkTheme = theme === "dark";

  const handleThemeChange = (isChecked: boolean) => {
    setTheme(isChecked ? "dark" : "light");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-colors duration-300">
      <div className="flex h-full items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-primary" />
          <p className="text-lg font-bold text-foreground">My App</p>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch id="theme-mode" checked={isDarkTheme} onCheckedChange={handleThemeChange} aria-label="Toggle Dark Mode" />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>

          {!pathname.includes("/login") && (
            <Link href="/login">
              <Button variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicLayoutHeader;
