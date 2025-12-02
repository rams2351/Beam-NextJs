"use client";

import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import { useResetPasswordMutation } from "@/react-query/auth.react-query";
import { showSuccessMsg } from "@/utils/client-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

// 1. Zod Validation Schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();

  const { mutate: resetPassword, isPending: isLoading } = useResetPasswordMutation();

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. Initialize Form
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 3. Submit Handler
  const onSubmit = async (data: ResetPasswordFormData) => {
    resetPassword(
      { password: data.password },
      {
        onSuccess: () => {
          showSuccessMsg("Password reset successfully!");
          setIsSuccess(true);
        },
      }
    );

    setTimeout(() => router.push("/login"), 3000);
  };

  return (
    <div className="flex h-full items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-background p-8 shadow-sm">
        {/* ================= STATE 2: SUCCESS ================= */}
        {isSuccess ? (
          <div className="text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Password Reset!</h2>
              <p className="text-sm text-muted-foreground">
                Your password has been successfully updated. You can now log in with your new credentials.
              </p>
            </div>

            <Link href="/login" className="block">
              <Button className="w-full" size="lg">
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          /* ================= STATE 1: RESET FORM ================= */
          <>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-6">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Set new password</h2>
              <p className="mt-2 text-sm text-muted-foreground">Your new password must be different from previously used passwords.</p>
            </div>

            <FormProvider {...form}>
              <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                {/* New Password Field */}
                <div className="relative">
                  <TextInput<ResetPasswordFormData>
                    control={form.control}
                    name="password"
                    label="New Password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    inputClassName="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <TextInput<ResetPasswordFormData>
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    inputClassName="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isLoading} size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </FormProvider>

            <div className="flex justify-center border-t border-border pt-6">
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <KeyRound className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
