"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../common/Button";
import Select from "../common/Select";
import TextInput from "../common/TextInput";

interface FormValues {
  select: string;
  textInput: string;
}

const SelectVariants: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(
      z.object({
        select: z.string().min(1),
        textInput: z.string().min(1),
      })
    ),
  });
  return (
    <div className="space-y-6 card  w-fit min-w-[300px] flex flex-col ">
      <h3 className="text-lg font-bold">Select and Input</h3>

      <div className="">
        <FormProvider {...form}>
          <Select
            control={form.control}
            name="select"
            size="sm"
            placeholder="Select an option"
            label="Helllo this select"
            options={[
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
              { label: "Option 3", value: "option3" },
            ]}
          />

          <TextInput
            control={form.control}
            name="textInput"
            placeholder="Hello this is a text input"
            className="mt-4"
            label="Hello this is a label"
          />

          <Button
            type="submit"
            onClick={form.handleSubmit((data) => {
              console.log(data);
            })}
          >
            Submit
          </Button>
        </FormProvider>
        <h1 className="text-sm">Tooltips</h1>
        <h1 className="text-sm">Skeleton</h1>
        <h1 className="text-sm">Popover</h1>
        <h1 className="text-sm">Dialog</h1>
        <h1 className="text-sm">Tooltips</h1>
      </div>
    </div>
  );
};

export default SelectVariants;
