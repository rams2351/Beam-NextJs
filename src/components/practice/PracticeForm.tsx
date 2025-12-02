"use client";
import Switch from "@/components/common/Switch";
import TextInput from "@/components/common/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../common/Button";
import Checkbox from "../common/Checkbox";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  isUser: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const FormPractice = () => {
  const [isChecked, setIsChecked] = useState(false);
  // 1. Define your form.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      isUser: true,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="space-y-5">
      <div>LoginPage</div>

      <TextInput
        onChange={(e) => {
          console.log("first", e);
        }}
        name="username"
        type="text"
        placeholder="Enter your name"
      />

      <FormProvider {...form}>
        <TextInput control={form.control} name="username" type="text" placeholder="Enter your name" label="Username " />

        <div className="p-20 space-y-5">
          <Switch size="sm" variant="outlined" control={form.control} name="isUser" label="Is User" labelPosition="end" labelClassName="" />
          <Switch size="md" variant="outlined" control={form.control} name="isUser" label="Is User" labelPosition="end" labelClassName="" />
          <Switch size="lg" variant="outlined" control={form.control} name="isUser" label="Is User" labelPosition="end" labelClassName="" />

          <Switch size="sm" variant="contained" control={form.control} name="isUser" label="Is User" labelPosition="end" labelClassName="" />
          <Switch size="md" variant="contained" control={form.control} name="isUser" label="Is User" labelPosition="end" labelClassName="" />
          <Switch size="lg" variant="contained" control={form.control} name="isUser" label="Is User" labelPosition="end" labelClassName="" />
        </div>

        <Checkbox control={form.control} variant="outlined" name="isUser" label="Is User" labelPosition="end" labelClassName="" />

        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          Submit
        </Button>
      </FormProvider>

      <div className="flex flex-row gap-10 px-20">
        <div className="">
          <p className="">Switch Small</p>
          <div className="space-x-3  mt-10">
            <Switch
              size="sm"
              variant="outlined"
              value={isChecked}
              onChange={(e: boolean) => {
                console.log("first", e);
                setIsChecked(e);
              }}
            />
            <Switch size="sm" variant="contained" value={isChecked} onChange={(e: boolean) => setIsChecked(e)} label="adfadfadfad foe daas" />
          </div>
          <div className="   space-x-3 mt-2">
            <Switch size="sm" variant="outlined" checked />
            <Switch size="sm" variant="contained" checked />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPractice;
