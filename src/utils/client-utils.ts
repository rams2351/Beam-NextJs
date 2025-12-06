import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import React from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
// Import Lucide icons
import { CheckCircle2, CircleX, Info, TriangleAlert } from "lucide-react";

// Reusable base styles for consistency
const toastBaseStyle = "items-start gap-3 rounded-2xl w-[300px] font-bold text-[16px]";
const toastDescStyle = "text-[13px] font-[500]";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showErrorMsg = (msg: any) => {
  toast.error("Error", {
    description: msg,
    // Uses 'destructive' from theme
    className: cn("bg-destructive text-destructive-foreground", toastBaseStyle),
    descriptionClassName: toastDescStyle,
    icon: React.createElement(CircleX, { size: 24, className: "text-destructive-foreground mt-3" }),
  });
};

export const showSuccessMsg = (msg: any) => {
  toast.success("Success", {
    description: msg,
    // Uses 'success' from theme (#5AB752)
    className: cn("bg-success text-success-foreground", toastBaseStyle),
    descriptionClassName: toastDescStyle,
    icon: React.createElement(CheckCircle2, { size: 24, className: "text-success-foreground mt-3" }),
  });
};

export const showInfoMsg = (msg: any) => {
  toast.info("Info", {
    description: msg,
    // Uses 'info' from theme (Blue)
    className: cn("bg-info text-info-foreground", toastBaseStyle),
    descriptionClassName: toastDescStyle,
    icon: React.createElement(Info, { size: 24, className: "text-info-foreground mt-3" }),
  });
};

export const showWarningMsg = (msg: any) => {
  toast.warning("Warning", {
    description: msg,
    // Uses 'warning' from theme (Amber/Yellow)
    className: cn("bg-warning text-warning-foreground", toastBaseStyle),
    descriptionClassName: "text-[11px] font-[300]", // Kept your specific font weight for warning
    icon: React.createElement(TriangleAlert, { size: 24, className: "text-warning-foreground mt-3" }),
  });
};

export function sleep(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const formatDate = (date: Date | string, format: string) => {
  return moment(date).format(format);
};
