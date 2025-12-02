"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/shadcn/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/shadcn/input-otp";
import { useRequestForForgotPasswordMutation, useValidateOtpForPasswordResetMutation } from "@/react-query/auth.react-query";
import { showSuccessMsg } from "@/utils/client-utils";
import { useRouter } from "next/navigation";

// 1. Zod Validation Schemas
const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
});

const pinFormSchema = z.object({
  pin: z.string().min(6, { message: "Your OTP must be 6 digits." }).regex(/^\d+$/, { message: "OTP must contain only numbers." }), // Strict number check
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type PinFormData = z.infer<typeof pinFormSchema>;

export default function ForgotPasswordPage() {
  const { mutate: requestForgotPassword, isPending } = useRequestForForgotPasswordMutation();
  const { mutate: validateOtp, isPending: isVerifyingOtp } = useValidateOtpForPasswordResetMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  // Form 1: Email
  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Form 2: OTP
  const pinForm = useForm<PinFormData>({
    resolver: zodResolver(pinFormSchema),
    defaultValues: { pin: "" },
  });

  // Handler: Send Email
  const onSendEmail = (data: ForgotPasswordFormData) => {
    requestForgotPassword(data, {
      onSuccess: () => {
        showSuccessMsg("OTP sent to your email!");
        pinForm.reset();
        setIsSubmitted(true);
      },
      onError: (error: any) => {
        console.error(error);
      },
    });
  };

  // Handler: Verify OTP
  const onValidateOtp = async (data: PinFormData) => {
    try {
      const payload = { email: emailForm.getValues("email"), pin: data.pin };
      validateOtp(payload, {
        onSuccess: (response: any) => {
          if (response.success) {
            router.push("/reset-password");

            showSuccessMsg("OTP Verified Successfully!");
            router.push("/reset-password");
          }
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleResend = () => {
    // Logic to resend OTP
    const email = emailForm.getValues("email");
    onSendEmail({ email });
  };

  const handleChangeEmail = () => {
    pinForm.reset();
    emailForm.reset();
    setIsSubmitted(false);
  };
  return (
    <div className="flex h-full items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-background p-8 shadow-sm">
        {/* ================= STATE 2: ENTER OTP ================= */}
        {isSubmitted ? (
          <div className="text-center space-y-6">
            {/* Header Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>

            {/* Header Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We've sent a 6-digit code to <br />
                <span className="font-medium text-foreground">{emailForm.getValues("email")}</span>
              </p>
            </div>

            {/* OTP Form */}
            <Form {...pinForm}>
              <form onSubmit={pinForm.handleSubmit(onValidateOtp)} className="flex flex-col items-center space-y-6">
                <FormField
                  control={pinForm.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center space-y-4">
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          pattern="^[0-9]*$" // Hints mobile keyboard to show numbers
                          inputMode="numeric"
                          {...field}
                        >
                          <InputOTPGroup className="gap-2">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                className="h-10 w-10 rounded-md border border-input text-lg shadow-sm transition-all focus:ring-2 focus:ring-ring focus:border-ring"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" size="lg" disabled={isVerifyingOtp}>
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer Actions */}
            <div className="space-y-4 pt-2">
              <div className="text-sm text-muted-foreground">
                Didn't receive the email?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-primary hover:underline underline-offset-4"
                  disabled={isPending}
                >
                  {isPending ? "Resending..." : "Click to resend"}
                </button>
              </div>

              <div className="border-t border-border pt-4">
                {/* Reusing the "Back to Login" UI from state 1 for consistency */}
                <Button
                  variant="link"
                  onClick={handleChangeEmail}
                  className="flex w-full items-center justify-center gap-2 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Change Email
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= STATE 1: ENTER EMAIL ================= */
          <>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-6">
                <KeyRound className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Forgot password?</h2>
              <p className="mt-2 text-sm text-muted-foreground">Enter your email address and we'll send you a code to reset your password.</p>
            </div>

            <Form {...emailForm}>
              <form className="space-y-6" onSubmit={emailForm.handleSubmit(onSendEmail)}>
                <TextInput<ForgotPasswordFormData>
                  control={emailForm.control}
                  name="email"
                  label="Email"
                  placeholder="name@example.com"
                  type="email"
                />

                <Button type="submit" className="w-full" disabled={isPending} size="lg">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </Button>
              </form>
            </Form>

            <div className="flex justify-center border-t border-border pt-6">
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
