"use client";

import SocialAuth from "@/components/auth/SocialAuth";
import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import { useRegisterMutation } from "@/react-query/auth.react-query";
import { showSuccessMsg } from "@/utils/client-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

// 1. Zod Validation Schema
const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Highlights the confirmPassword field on error
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  // 2. Use the React Query Hook
  // 'mutate' is the function we call to trigger the API
  // 'isPending' replaces our manual 'isLoading' state
  const { mutate: registerUser, isPending } = useRegisterMutation();

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 3. Initialize React Hook Form
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 4. Submit Handler
  const onSubmit = (data: RegisterFormData) => {
    // We pass the data to the mutation
    registerUser(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        // React Query allows us to handle success/error right here in the component
        onSuccess: () => {
          showSuccessMsg("Account created successfully!");
          router.push("/login");
        },
        onError: (error: any) => {
          // Errors are handled globally by callApi toast,
          // but you can add specific logic here if needed.
          console.error("Registration failed:", error);
        },
      }
    );
  };

  return (
    <div className="flex h-full items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-background p-8 shadow-sm">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground">Create an account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <FormProvider {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Name Field */}
            <TextInput<RegisterFormData> control={form.control} name="name" label="Full Name" placeholder="John Doe" type="text" />

            {/* Email Field */}
            <TextInput<RegisterFormData> control={form.control} name="email" label="Email" placeholder="name@example.com" type="email" />

            {/* Password Field */}
            <div className="relative">
              <TextInput<RegisterFormData>
                control={form.control}
                name="password"
                label="Password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                inputClassName="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // Position the icon considering the label height (approx top-9)
                className="absolute right-3 top-9 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <TextInput<RegisterFormData>
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isPending} // Use React Query's pending state
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </FormProvider>

        {/* Divider */}
        <div className="relative mt-6">
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
