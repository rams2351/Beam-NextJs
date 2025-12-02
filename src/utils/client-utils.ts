import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import React from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
// Import Lucide icons
import { CheckCircle2, CircleX, Info, TriangleAlert } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showErrorMsg = (msg: any) => {
  toast.error("Error", {
    description: msg,
    className: "bg-[#E53935] text-white items-start gap-3 rounded-2xl w-[300px] font-bold text-[16px]",
    descriptionClassName: "text-[13px] font-[400]",
    // Replaced GiCancel with CircleX
    icon: React.createElement(CircleX, { size: 24, className: "text-white mt-3" }),
  });
};

export const showSuccessMsg = (msg: any) => {
  toast.success("Success", {
    description: msg,
    className: "bg-[#5AB752] text-white items-start gap-3 rounded-2xl w-[300px] font-bold text-[16px]",
    descriptionClassName: "text-[11px] font-[300]",
    // Replaced PiSealCheck with CheckCircle2
    icon: React.createElement(CheckCircle2, { size: 24, className: "text-white mt-3" }),
  });
};

export const showInfoMsg = (msg: any) => {
  toast.info("Info", {
    description: msg,
    className: "bg-primary-900 text-white items-start gap-3 rounded-2xl w-[300px] font-bold text-[16px]",
    descriptionClassName: "text-[11px] font-[300]",
    // Replaced MdInfo with Info
    icon: React.createElement(Info, { size: 24, className: "text-white mt-3" }),
  });
};

export const showWarningMsg = (msg: any) => {
  toast.warning("Warning", {
    description: msg,
    className: "bg-yellow-500 text-white items-start gap-3 rounded-2xl w-[300px] font-bold text-[16px]",
    descriptionClassName: "text-[11px] font-[300]",
    // Replaced MdWarningAmber with TriangleAlert
    icon: React.createElement(TriangleAlert, { size: 24, className: "text-white mt-3" }),
  });
};

export function sleep(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const formatDate = (date: Date | string, format: string) => {
  return moment(date).format(format);
};
