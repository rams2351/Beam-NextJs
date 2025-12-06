"use client";

import SocialAuth from "@/components/auth/SocialAuth";
import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import { useLoginMutation } from "@/react-query/auth.react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

// 1. Zod Validation Schema
const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const defaultValues = process.env.NEXT_PUBLIC_ENV == "local" ? { email: "admin@example.com", password: "password123" } : { email: "", password: "" };

export default function LoginPage() {
  const { mutate: loginUser, isPending } = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize React Hook Form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmit = (data: LoginFormData) => {
    loginUser(data);
  };

  return (
    <div className="flex h-full flex-1 items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-background p-8 shadow-sm">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        <FormProvider {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Email Field - Standard Usage */}
            <TextInput<LoginFormData> control={form.control} name="email" label="Email" placeholder="m@example.com" type="email" />

            {/* Password Field - Custom Layout for Label & Icon */}
            <div className="space-y-2">
              {/* Custom Label Row to include 'Forgot Password' */}
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium leading-none text-foreground">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <TextInput<LoginFormData>
                  control={form.control}
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  // We pass no label here because we rendered it manually above
                  className="relative"
                  inputClassName="pr-10" // Add padding for the eye icon
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </FormProvider>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <SocialAuth />
      </div>
    </div>
  );
}
