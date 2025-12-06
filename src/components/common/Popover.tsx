"use client";

import { cn } from "@/utils/client-utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import React from "react";

// ----------------------------------------------------------------------
// 1. The "Smart" Wrapper (High-level usage)
// ----------------------------------------------------------------------

interface PopoverProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {
  trigger?: React.ReactNode; // The element that opens the popover
  content: React.ReactNode; // What goes inside
  anchorEl?: HTMLElement | null; // For "Virtual" positioning (e.g. right-click menu, text selection)

  // Content styling props
  contentClassName?: string;
  align?: "center" | "start" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  showArrow?: boolean;
}

const Popover: React.FC<PopoverProps> = ({
  children, // Deprecated in wrapper mode, but kept for safety
  trigger,
  content,
  anchorEl,
  contentClassName,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  showArrow = false,
  ...props // Passes open, onOpenChange, etc. to Root
}) => {
  return (
    <PopoverPrimitive.Root {...props}>
      {/* CASE A: Standard Trigger (Click a button) */}
      {trigger && <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>}

      {/* CASE B: Virtual Anchor (e.g., following cursor or text selection) */}
      {anchorEl && <PopoverPrimitive.Anchor virtualRef={{ current: anchorEl }} />}

      {/* The Content */}
      <PopoverContent className={contentClassName} align={align} side={side} sideOffset={sideOffset}>
        {content}
        {showArrow && <PopoverPrimitive.Arrow className="fill-popover border-t border-l border-gray-200" />}
      </PopoverContent>
    </PopoverPrimitive.Root>
  );
};

export default Popover;

// ----------------------------------------------------------------------
// 2. The Primitives (Exported for Custom Layouts)
// ----------------------------------------------------------------------

export const PopoverRoot = PopoverPrimitive.Root;

export const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, ...props }, ref) => <PopoverPrimitive.Trigger ref={ref} className={cn(className)} {...props} />);
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

export const PopoverAnchor = PopoverPrimitive.Anchor;

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "bg-white dark:bg-gray-950", // Ensure background color is set
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
