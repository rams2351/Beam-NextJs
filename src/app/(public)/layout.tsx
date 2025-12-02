"use client";

import PublicLayoutHeader from "@/components/public-layout/PublicLayoutHeader";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* 1. The Fixed Header */}
      <PublicLayoutHeader />

      {/* 2. Main Content */}
      <main className="container mx-auto flex-1 max-w-screen-2xl px-4 py-8 pt-16">{children}</main>
    </div>
  );
};

export default PublicLayout;
