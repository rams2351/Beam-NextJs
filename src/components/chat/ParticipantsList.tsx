"use client";

import { useGetUserQuery } from "@/react-query/user.react-query";
import Image from "next/image";
import React from "react";

// 1. Define the props for the UI component
interface ParticipantsListItemProps {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  isOnline?: boolean;
  onClick?: (id: string) => void;
}

export const ParticipantsList: React.FC<ParticipantsListItemProps> = ({ id, name, avatar, email, isOnline = false, onClick }) => {
  const { data: user } = useGetUserQuery();

  console.log("USER", user);
  // Helper to generate initials if no avatar is present
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      onClick={() => onClick?.(id)}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 transition-all hover:bg-secondary/80 active:scale-[0.98]"
    >
      {/* Avatar Container */}
      <div className="relative">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-muted shadow-sm">
          {avatar ? (
            <Image src={avatar} alt={name} fill className="object-cover" sizes="48px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold">{initials}</div>
          )}
        </div>

        {/* Online Status Indicator (Beam Orange) */}
        {isOnline && (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-primary ring-2 ring-background transition-transform duration-300 animate-in zoom-in" />
        )}
      </div>

      {/* Text Info */}
      <div className="flex flex-1 flex-col overflow-hidden text-left">
        <h4 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h4>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
  );
};
