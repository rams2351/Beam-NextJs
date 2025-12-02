import { cn } from "@/utils/client-utils";
import { Label } from "@radix-ui/react-label";
import React, { ComponentProps, Fragment } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../shadcn/form";
interface TextInputProps<T extends FieldValues> extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  control?: Control<T, FieldPath<T>>;
  name?: FieldPath<T>;
  labelClassName?: string;
  inputClassName?: string;
}

const TextInput = <T extends FieldValues>({ label, control, name, labelClassName, inputClassName, className, type, ...props }: TextInputProps<T>) => {
  return (
    <Fragment>
      {control ? (
        <FormField
          control={control}
          name={name as FieldPath<T>}
          render={({ field }) => (
            <FormItem className={cn("gap-0", className)}>
              {label && <FormLabel className={cn("mb-1.5 px-0.5 text-sm font-medium", labelClassName)}>{label}</FormLabel>}
              <FormControl className="my-0">
                <ShadcnTextInput className={inputClassName} type={type} {...props} {...field} />
              </FormControl>
              {/* <FormDescription>This is your public display name.</FormDescription> */}
              <FormMessage className="mt-0 font-serif text-sm px-0.5" />
            </FormItem>
          )}
        />
      ) : (
        <div className={cn("", className)}>
          {label && <Label className="mb-1.5 px-0.5 text-sm font-medium">{label}</Label>}
          <ShadcnTextInput className={inputClassName} type={type} {...props} />
        </div>
      )}
    </Fragment>
  );
};

export default TextInput;

const ShadcnTextInput: React.FC<ComponentProps<"input">> = ({ className, type, ...props }) => {
  return (
    <Fragment>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-transparent border-input flex h-9 w-full min-w-0   border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "shadcn-input-select",
          className
        )}
        {...props}
      />
    </Fragment>
  );
};
