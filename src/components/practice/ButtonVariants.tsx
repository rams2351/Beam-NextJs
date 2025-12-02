"use client";
import Button from "@/components/common/Button";
import { MoreVertical } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import Dialog from "../common/Dialog";
import Popover from "../common/Popover";
import Skeleton from "../common/Skeleton";
import Tooltip from "../common/Tooltip";

const ButtonVariants: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [popoverAlign, setPopoverAlign] = useState<"start" | "center" | "end">("center");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (type: "success" | "error" | "warning" | "info") => {
    toast[type]("Event has been created.");
  };

  return (
    <div className="card w-fit min-w-[300px] flex flex-col">
      <h3 className="text-lg font-bold">Button Variants</h3>

      <Tooltip content={<div>hellooooo</div>} delayDuration={500}>
        <p className="mt-5">Tooltip</p>
      </Tooltip>

      <div className="flex flex-col gap-4 items-center mt-8">
        <Button onClick={() => setOpen(true)}>Click me</Button>
        <Button onClick={() => handleClick("success")} variant="secondary">
          Click me
        </Button>
        <Button onClick={() => handleClick("error")} variant="destructive">
          Click me
        </Button>
        <Button onClick={() => handleClick("warning")} variant="outline">
          Click me
        </Button>
        <Button onClick={() => handleClick("info")} variant="ghost">
          Click me
        </Button>

        <Button variant="outline" onClick={(e) => setAnchorEl(e.currentTarget)} className="p-0 rounded-full px-0  py-0">
          <MoreVertical />
        </Button>

        <Button variant="outline" onClick={() => setPopoverAlign("start")}>
          start
        </Button>
        <Button variant="outline" onClick={() => setPopoverAlign("center")}>
          center
        </Button>
        <Button variant="outline" onClick={() => setPopoverAlign("end")}>
          end
        </Button>
      </div>

      <Skeleton className="w-full h-full b" />

      <Dialog
        open={open}
        onOpenChange={setOpen}
        rightButtonLabel="Save"
        leftButtonLabel="Close"
        onClickRightButton={() => handleClick("success")}
        title="Dialog Title"
      >
        <div className="p-5">hellloo</div>
      </Dialog>

      <Popover anchorEl={anchorEl} open={Boolean(anchorEl)} onOpenChange={() => setAnchorEl(null)} className="" align={popoverAlign}>
        hdafadfadfadf
      </Popover>
    </div>
  );
};

export default ButtonVariants;
