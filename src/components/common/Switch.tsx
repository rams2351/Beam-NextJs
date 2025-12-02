"use client";

import { cn } from "@/utils/client-utils";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import React, { ComponentProps, Fragment, useMemo } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../shadcn/form";
import { Label } from "../shadcn/label";

const labelClasses = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};

const switchVariantClasses = {
  contained: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input border-transparent",
  outlined: [
    "bg-transparent",
    "data-[state=checked]:border-primary data-[state=unchecked]:border-input",
    "data-[state=checked]:bg-primary/10 data-[state=unchecked]:bg-transparent",
  ],
};

const switchSizeClasses = {
  sm: "h-[14px] w-[1.5rem]",
  md: "h-[18px] w-8",
  lg: "h-[21.76px] w-10",
};

const switchThumbVariantClasses = {
  contained: ["bg-white dark:bg-gray-300", "dark:data-[state=checked]:bg-primary-foreground"],
  outlined: [
    "data-[state=unchecked]:bg-gray-200",
    "data-[state=checked]:bg-primary",
    "dark:data-[state=unchecked]:bg-gray-300",
    "dark:data-[state=checked]:bg-primary",
  ],
};

const switchThumbSizeClasses = {
  sm: "size-[12px] data-[state=checked]:translate-x-[calc(100%-2px)]",
  md: "size-4 data-[state=checked]:translate-x-[calc(100%-2px)]",
  lg: "size-5 data-[state=checked]:translate-x-[calc(100%-2px)]",
};

// @ts-expect-error for form control value and onChange different types according to the switch component
interface SwitchProps<T extends FieldValues> extends ComponentProps<typeof SwitchPrimitive.Root> {
  size?: "sm" | "md" | "lg";
  variant?: "contained" | "outlined";
  control?: Control<any, any, any>;
  name?: FieldPath<T>;
  value?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  labelClassName?: string;
  labelPosition?: "start" | "end";
}

const Switch = <T extends FieldValues>({ control, name, ...props }: SwitchProps<T>) => {
  return (
    <Fragment>
      {control ? (
        <FormField
          control={control}
          name={name as FieldPath<T>}
          render={({ field }) => (
            <FormItem className="gap-0">
              <FormControl className="my-0">
                <SwitchComponent {...props} {...field} />
              </FormControl>
              <FormMessage className="mt-0 font-serif text-sm px-0.5" />
            </FormItem>
          )}
        />
      ) : (
        <SwitchComponent {...props} />
      )}
    </Fragment>
  );
};

export default React.memo(Switch);

const SwitchComponent: React.FC<SwitchProps<FieldValues>> = React.memo(
  ({ label, labelClassName, labelPosition = "end", className, size = "md", variant = "contained", value, onChange, ...props }) => {
    const handleChange = (checked: boolean) => {
      if (onChange) {
        onChange(checked);
      }
    };
    const id = useMemo(() => props.id || label?.toString()?.trim(), [label, props.id]);

    const SwitchLabel = useMemo(() => {
      return (
        <Label htmlFor={id} className={cn("cursor-pointer", labelClasses[size], labelClassName)}>
          {label}
        </Label>
      );
    }, [label, labelClassName, id, size]);

    return (
      <div className="flex items-center gap-2">
        {label && labelPosition === "start" && SwitchLabel}
        <SwitchPrimitive.Root
          data-slot="switch"
          checked={value as unknown as boolean}
          onCheckedChange={handleChange}
          id={id}
          className={cn(
            "peer inline-flex shrink-0 items-center rounded-full border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            switchSizeClasses[size],
            switchVariantClasses[variant],
            "focus-visible:border-ring focus-visible:ring-ring/50",
            className
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            data-slot="switch-thumb"
            className={cn(
              "pointer-events-none block rounded-full ring-0 transition-transform",
              switchThumbVariantClasses[variant],
              switchThumbSizeClasses[size],
              "data-[state=unchecked]:translate-x-0"
            )}
          />
        </SwitchPrimitive.Root>
        {label && labelPosition === "end" && SwitchLabel}
      </div>
    );
  }
);
SwitchComponent.displayName = "SwitchComponent";
