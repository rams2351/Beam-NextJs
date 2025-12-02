"use client";
import { cn } from "@/utils/client-utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { ComponentProps, Fragment, useCallback, useMemo } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../shadcn/form";
import { Label } from "../shadcn/label";

const checkboxVariantClass = {
  contained: ["bg-secondary", "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", "data-[state=unchecked]:text-primary"],
  outlined: [
    "border border-gray-400",
    "data-[state=checked]:bg-primary/10 data-[state=unchecked]:bg-transparent border-primary",
    "data-[state=checked]:text-foreground border-input",
  ],
};

const checkboxIndicatorVariantClass = {
  contained: "text-primary-foreground",
  outlined: "text-primary",
};

const checkboxSizeClass = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const checkboxIndicatorSizeClass = {
  sm: "size-2",
  md: "size-3",
  lg: "size-4",
};

const checkboxLabelSizeClass = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};

// @ts-expect-error for form control value and onChange different types according to the checkbox component
interface CheckboxProps<T extends FieldValues> extends ComponentProps<typeof CheckboxPrimitive.Root> {
  size?: "sm" | "md" | "lg";
  variant?: "contained" | "outlined";
  control?: Control<T, FieldPath<T>>;
  name?: FieldPath<T>;
  value?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  labelClassName?: string;
  labelPosition?: "start" | "end";
}

const Checkbox = <T extends FieldValues>({ control, name, ...props }: CheckboxProps<T>) => {
  return (
    <Fragment>
      {control ? (
        <FormField
          control={control}
          name={name as FieldPath<T>}
          render={({ field }) => (
            <FormItem className="gap-0">
              <FormControl className="my-0">
                <CheckboxComponent {...props} {...field} />
              </FormControl>
              <FormMessage className="mt-0 font-serif text-sm px-0.5" />
            </FormItem>
          )}
        />
      ) : (
        <CheckboxComponent {...props} />
      )}
    </Fragment>
  );
};

export default Checkbox;

const CheckboxComponent: React.FC<CheckboxProps<FieldValues>> = ({
  label,
  labelClassName,
  labelPosition = "end",
  className,
  size = "md",
  variant = "contained", // Default to "contained"
  value,
  onChange,
  ...props
}) => {
  const handleChange = useCallback(
    (checked: boolean) => {
      if (onChange) {
        onChange(checked);
      }
    },
    [onChange]
  );

  const id = useMemo(() => props.id || label?.toString()?.trim(), [label, props.id]);

  const CheckboxLabel = useMemo(() => {
    return (
      <Label htmlFor={id} className={cn("cursor-pointer", checkboxLabelSizeClass[size], labelClassName)}>
        {label}
      </Label>
    );
  }, [label, labelClassName, id, size]);

  return (
    <div className="flex items-center gap-2">
      {label && labelPosition === "start" && CheckboxLabel}

      <CheckboxPrimitive.Root
        data-slot="checkbox"
        checked={value as unknown as boolean}
        onCheckedChange={handleChange}
        id={id}
        className={cn(
          "peer inline-flex items-center justify-center rounded-[5px]  shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:ring-1  hover:data-[state=checked]:ring-foreground",
          checkboxVariantClass[variant],
          checkboxSizeClass[size],
          "focus-visible:border-ring focus-visible:ring-ring/50",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center text-current">
          <CheckIcon className={cn(checkboxIndicatorSizeClass[size], checkboxIndicatorVariantClass[variant])} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && labelPosition === "end" && CheckboxLabel}
    </div>
  );
};
