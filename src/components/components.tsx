"use client";
import Metadata from "@/components/common/Metadata";
import TextInput from "@/components/common/TextInput";

import Loading from "@/services/LoadingService";
import { Checkbox } from "@radix-ui/react-checkbox";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { toast } from "sonner";
import Button from "./common/Button";

const Components: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <Metadata seoTitle={`${process.env.NEXT_PUBLIC_APP_NAME} | Login`} seoDescription="Login to your account" />
      <div className="text-primary font-poppins font">LoginPage</div>
      <button
        className="font-cursive mr-3 bg-primary px-4 py-2 rounded-md text-primary-foreground ripple"
        onClick={() => toast.success("Event has been created.")}
      >
        hello
      </button>

      <Button variant="ghost" className=" " onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        <Loader2 className="animate-spin" />
        <span>Click me</span>
      </Button>

      <Checkbox disabled />
      <button
        className="mt-10"
        onClick={() => {
          Loading.showLoading();
          setTimeout(() => {
            Loading.hideLoading();
          }, 3000);
        }}
      >
        click me
      </button>

      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <label htmlFor="option-one">Option One</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="option-two" />
          <label htmlFor="option-two">Option Two</label>
        </div>
      </RadioGroup>

      <div className="mt-10">
        <TextInput name="" type="text" placeholder="Enter your name" />
      </div>
    </div>
  );
};

export default Components;
