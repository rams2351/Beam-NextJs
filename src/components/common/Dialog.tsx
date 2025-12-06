import { cn } from "@/utils/client-utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2, XIcon } from "lucide-react"; // Added Loader for async actions
import React from "react";
import Button from "./Button"; // Assuming your Button accepts standard props

// ----------------------------------------------------------------------
// 1. The "Easy Mode" Wrapper (What you primarily asked for)
// ----------------------------------------------------------------------

interface DialogProps extends DialogPrimitive.DialogProps {
  trigger?: React.ReactNode; // The button that opens the dialog
  title?: string;
  description?: string;
  children?: React.ReactNode;

  // Footer / Action Buttons
  showCloseIcon?: boolean; // Option to hide the 'X' icon
  closeLabel?: string;
  actionLabel?: string;
  onAction?: () => void | Promise<void>; // Supports Async
  onClose?: () => void;
  isLoading?: boolean; // Loading state for the action button
  isDestructive?: boolean; // If true, action button becomes red (e.g. Delete)

  // Styling
  className?: string;
  contentClassName?: string;
}

const Dialog: React.FC<DialogProps> = ({
  trigger,
  title,
  description,
  children,
  closeLabel,
  actionLabel = "Confirm",
  onAction,
  onClose,
  isLoading = false,
  isDestructive = false,
  showCloseIcon = true,
  className,
  contentClassName,
  ...props
}) => {
  return (
    <DialogPrimitive.Root {...props}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}

      <DialogContent aria-describedby={description ? undefined : undefined} className={cn("sm:max-w-lg", className)} showCloseIcon={showCloseIcon}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {/* LOGIC FIX: */}
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : (
              // If no description provided, render a hidden one to satisfy Radix A11y
              <DialogDescription className="sr-only">Dialog</DialogDescription>
            )}
          </DialogHeader>
        )}

        {/* Dynamic Content Area - Defaulting to vertical stack */}
        <div className={cn("py-4", contentClassName)}>{children}</div>

        {/* Footer Area - Only renders if labels are provided */}
        {(actionLabel || closeLabel) && (
          <DialogFooter className="gap-2">
            {closeLabel && (
              <DialogPrimitive.Close asChild>
                <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                  {closeLabel}
                </Button>
              </DialogPrimitive.Close>
            )}

            {actionLabel && onAction && (
              <Button
                variant={isDestructive ? "destructive" : "default"} // Assumes your button has a destructive variant
                onClick={onAction}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {actionLabel}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </DialogPrimitive.Root>
  );
};

export { Dialog }; // Named export for specific imports
export default Dialog; // Default export for ease of use

// ----------------------------------------------------------------------
// 2. The Primitives (Industry Standard: Export these for custom layouts)
// ----------------------------------------------------------------------

export const DialogRoot = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { showCloseIcon?: boolean }
>(({ className, children, showCloseIcon = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Mobile-first sizing: w-full on small screens, fixed max-width on larger screens
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4  bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
      {showCloseIcon && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer">
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />);
DialogDescription.displayName = DialogPrimitive.Description.displayName;
