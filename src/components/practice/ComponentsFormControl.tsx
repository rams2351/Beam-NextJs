"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../common/Button";
import Checkbox from "../common/Checkbox";
import RadioGroup from "../common/RadioGroup";
import Select from "../common/Select";
import Switch from "../common/Switch";
import TextInput from "../common/TextInput";

interface FormValues {
  name: string;
  email: string;
  country: string;
  isActive: boolean;
  gender: string;
  isPremium: boolean;
}
const ComponentsFormControl: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        country: z.string().min(1, { message: "Country is required" }),
        isActive: z.boolean(),
        gender: z.string().min(1, { message: "Gender is required" }),
        isPremium: z.boolean(),
      })
    ),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      isActive: false,
      gender: "",
      isPremium: false,
    },
  });

  const handleSubmit = (data: FormValues) => {
    console.log("Form submitted", data);
  };

  return (
    <div className="card p-10 m-10 space-y-4">
      <h3 className="text-lg font-bold">Form Control</h3>

      <FormProvider {...form}>
        <TextInput control={form.control} name="name" label="Name" />
        <TextInput control={form.control} name="email" label="Email" />

        <Select
          className="bg w-[280px]"
          control={form.control}
          name="country"
          label="Country"
          options={[
            { label: "United States", value: "US" },
            { label: "Canada", value: "CA" },
            { label: "Mexico", value: "MX" },
          ]}
        />

        <Switch control={form.control} name="isActive" label="Is Active" />

        <RadioGroup
          labelPosition="start"
          control={form.control}
          name="gender"
          label="Gender"
          size="sm"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />

        <Checkbox control={form.control} name="isPremium" label="Is Premium" />

        <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
          Submit
        </Button>
      </FormProvider>
    </div>
  );
};

export default ComponentsFormControl;
