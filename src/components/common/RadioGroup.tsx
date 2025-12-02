"use client";

import { cn } from "@/utils/client-utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import React, { ComponentProps, FormEvent, Fragment, useId, useMemo } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../shadcn/form";
import { Label } from "../shadcn/label";

const radioGroupSizeClass = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const radioThumbSizeClass = {
  sm: "size-2",
  md: "size-3",
  lg: "size-4",
};

const labelSizeClass = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};

const radioGroupVariantClass = {
  contained: "bg-secondary ",
  outlined: "bg-background border-1",
};

const radioThumbVariantClass = {
  contained: "fill-primary",
  outlined: "text-primary bg-primary rounded-full",
};

interface RadioGroupProps<T extends FieldValues> extends ComponentProps<typeof RadioGroupPrimitive.Root> {
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "contained" | "outlined";
  options: { value: string; label: string }[];
  optionTextPosition?: "start" | "end";
  optionTextClassName?: string;
  labelClassName?: string;
  control?: Control<any, any, any>;
  name?: FieldPath<T>;
  value?: string;
  onValueChange?: (checked: string) => void;
  labelPosition?: "start" | "end";
}

const RadioGroup = <T extends FieldValues>({ control, name, label, labelClassName, ...props }: RadioGroupProps<T>) => {
  return (
    <Fragment>
      {control ? (
        <FormField
          control={control}
          name={name as FieldPath<T>}
          render={({ field }) => (
            <FormItem className="gap-0">
              {label && <FormLabel className={cn("mb-1 px-0.5", labelClassName)}>{label}</FormLabel>}
              <FormControl className="my-0">
                <RadioGroupComponent {...props} {...field} />
              </FormControl>
              <FormMessage className="mt-0 font-serif text-sm px-0.5" />
            </FormItem>
          )}
        />
      ) : (
        <Fragment>
          <Label className={labelClassName}> {label} </Label>
          <RadioGroupComponent {...props} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default React.memo(RadioGroup);

const RadioGroupComponent: React.FC<RadioGroupProps<FieldValues>> = React.memo(
  ({ className, options, optionTextPosition, optionTextClassName, variant, size = "sm", onChange, value, ...props }) => {
    const handleChange = (value: string) => {
      if (onChange) {
        onChange(value as unknown as FormEvent<HTMLDivElement>);
      }
    };

    return (
      <RadioGroupPrimitive.Root data-slot="radio-group" onValueChange={handleChange} value={value} className={cn("grid gap-3", className)} {...props}>
        {options.map((option) => (
          <RadioOptionItem
            key={option.value}
            {...option}
            optionTextPosition={optionTextPosition}
            optionTextClassName={optionTextClassName}
            variant={variant}
            size={size}
          />
        ))}
      </RadioGroupPrimitive.Root>
    );
  }
);
RadioGroupComponent.displayName = "RadioGroupComponent";

const RadioOptionItem = React.memo(
  ({
    optionTextClassName,
    optionTextPosition = "end",
    label,
    size = "md",
    variant = "contained",
    ...props
  }: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
    optionTextClassName?: string;
    optionTextPosition?: "start" | "end";
    size?: "sm" | "md" | "lg";
    variant?: "contained" | "outlined";
    label: string;
  }) => {
    const id = useId();

    const OptionText = useMemo(() => {
      console.log("adfasfasdfasd", label);
      return (
        <Label htmlFor={id} className={cn(props.disabled ? "cursor-not-allowed!" : "cursor-pointer", optionTextClassName, labelSizeClass[size])}>
          {label}
        </Label>
      );
    }, [id, label, optionTextClassName, size, props.disabled]);

    const thumbClasses = useMemo(() => cn(radioThumbVariantClass[variant], radioThumbSizeClass[size]), [size, variant]);
    const radioClasses = useMemo(
      () =>
        cn(
          "text-primary focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square shrink-0 rounded-full shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:ring-1  hover:data-[state=checked]:ring-foreground",
          radioGroupSizeClass[size],
          radioGroupVariantClass[variant]
        ),
      [size, variant]
    );
    return (
      <div className="flex items-center gap-2">
        {optionTextPosition === "start" && OptionText}
        <RadioGroupPrimitive.Item data-slot="radio-group-item" id={id} className={radioClasses} {...props}>
          <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="relative flex items-center justify-center">
            <CircleIcon
              className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", thumbClasses)}
              strokeWidth={variant === "outlined" ? 5 : 2}
            />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
        {optionTextPosition === "end" && OptionText}
      </div>
    );
  }
);
RadioOptionItem.displayName = "RadioOptionItem";
