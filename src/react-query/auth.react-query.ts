import { callApi } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

// Types for better safety (Optional but recommended)
interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export function useLoginMutation() {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (body: LoginBody) => {
      return await callApi("/api/auth/login", {
        method: "POST",
        body,
      });
    },
    onSuccess: () => {
      // Hard reload to ensure clean state for the new user
      window.location.href = "/dashboard";
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      return await callApi("/api/auth/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (body: RegisterBody) => {
      return await callApi("/api/auth/register", {
        method: "POST",
        body,
      });
    },
    // We do NOT redirect here automatically.
    // We let the UI component handle the specific success message and redirection logic.
  });
}

export function useRequestForForgotPasswordMutation() {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (body: { email: string }) => {
      return await callApi("/api/auth/request-forgot-password", {
        method: "POST",
        body,
      });
    },
  });
}

export function useValidateOtpForPasswordResetMutation() {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (body: { email: string; pin: string }) => {
      return await callApi("/api/auth/validate-forgot-password-otp", {
        method: "POST",
        body,
      });
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (body: { password: string }) => {
      return await callApi("/api/auth/reset-password", {
        method: "POST",
        body,
      });
    },
  });
}
