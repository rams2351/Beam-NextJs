"use client";

import PrivateLayoutHeader from "@/components/private-layout/PrivateLayoutHeader";
import { useGetUserQuery } from "@/react-query/user.react-query";
import React from "react";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: userResponse, isPending, isError } = useGetUserQuery();

  // Uncomment this block if you want to block rendering until user is fetched
  /*
  if (isPending) {
   return (
     <div className="flex h-screen w-full items-center justify-center bg-background">
       <Loader2 className="h-10 w-10 animate-spin text-primary" />
     </div>
   );
  }
  */

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/10">
      <PrivateLayoutHeader />

      {/* Added 'mt-14' to account for the fixed header height */}
      <main className="container mx-auto flex-1 max-w-screen-2xl px-4 py-8 mt-14">{children}</main>
    </div>
  );
};

export default PrivateLayout;
