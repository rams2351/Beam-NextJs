"use client";

import { cn } from "@/utils/client-utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import React from "react";

interface PopoverProps extends PopoverPrimitive.PopoverProps, PopoverPrimitive.PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  anchorEl?: HTMLElement | null;
}

const Popover = ({ children, className, open, onOpenChange, align, anchorEl, ...props }: PopoverProps) => {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {/* Virtual anchor for positioning */}
      {anchorEl && (
        <PopoverPrimitive.Anchor
          virtualRef={{
            current: anchorEl,
          }}
        />
      )}
      <PopoverContent className={className} {...props} align={align}>
        {children}
      </PopoverContent>
    </PopoverPrimitive.Root>
  );
};

const PopoverContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof PopoverPrimitive.Content>>(
  ({ className, align = "center", sideOffset = 8, ...props }, ref) => {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "bg-background text-popover-foreground",
            "z-50 min-w-[100px] rounded-lg p-4 shadow-lg border border-gray-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  }
);

PopoverContent.displayName = "PopoverContent";

export default Popover;
