import UserModel from "@/database/models/user.model";
import { ResponseHandler } from "@/lib/api-server";
import { clearTokens, getResetPasswordTokenFromCookies, setResetPasswordTokenInCookies, setTokens } from "@/lib/cookies";
import { signAccessToken, signRefreshToken, signResetPasswordToken, verifyResetPasswordToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function loginUserController(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return ResponseHandler.error("Email and password are required!");
  }

  // CRITICAL FIX: We must explicitly select '+password_hash'
  // because it is set to { select: false } in the schema.
  const user = await UserModel.findOne({ email }).select("+password_hash");

  if (!user) {
    return ResponseHandler.error("Account does not exist with these credentials, please register first!");
  }

  // Safety check: User might be a Google-only user with no password
  if (!user.password_hash) {
    return ResponseHandler.error("Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return ResponseHandler.error("Invalid credentials");
  }

  const userObj = user.toObject();
  delete userObj.password_hash;

  const accessToken = signAccessToken(userObj);
  const refreshToken = signRefreshToken(userObj);

  await setTokens({ accessToken, refreshToken });

  return ResponseHandler.success(
    {
      user: userObj,
    },
    "Login successful"
  );
}

export async function logoutUserController() {
  // 1. Clear all auth cookies
  await clearTokens();

  return ResponseHandler.success(null, "Logged out successfully");
}

export async function userRegisterWithCredentialsController(req: NextRequest) {
  const body = await req.json();

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return ResponseHandler.error("Name, Email and Password are required");
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    return ResponseHandler.error("An account with this email already exists, please login instead");
  }

  const newUser = await UserModel.create({
    name,
    password_hash: password,
    email,
  });

  const userObj = newUser.toObject();
  delete userObj.password_hash;

  const accessToken = signAccessToken(userObj);
  const refreshToken = signRefreshToken(userObj);

  await setTokens({ accessToken, refreshToken });

  return ResponseHandler.success({ user: userObj }, "Registration successful!");
}

export async function requestForForgotPasswordController(req: NextRequest) {
  const body = await req.json();

  const { email } = body;

  if (!email) {
    return ResponseHandler.error("Email is required for Reseting password!");
  }

  const userExist = await UserModel.findOne({ email });

  if (!userExist) {
    return ResponseHandler.error("Account not exist with this email, please register instead!");
  }

  // sending otp on email on live projects here
  return ResponseHandler.success(null, "Otp Sent successfully!");
}

export async function validateForgotPasswordOtpController(req: NextRequest) {
  const body = await req.json();

  const { email, pin } = body;

  if (!pin || !email) {
    return ResponseHandler.error("A valid credentials required for reset password!");
  }

  // for now we just checking with 123456 otp will implement live functionality in project.

  if (pin !== "123456") {
    return ResponseHandler.error("Otp is not valid, please enter a valid otp for proceeding further!");
  }

  const reset_token = signResetPasswordToken(email);
  await setResetPasswordTokenInCookies(reset_token || "");

  return ResponseHandler.success({ opt: "verified" }, "Otp verification successfully");
}

export async function resetUserPasswordController(req: NextRequest) {
  const body = await req.json();
  const { password } = body;

  if (!password) {
    return ResponseHandler.error("New password is required");
  }

  const resetToken = await getResetPasswordTokenFromCookies();
  if (!resetToken) return ResponseHandler.error("Session Expired!");

  const verifiedPayload = verifyResetPasswordToken(resetToken);

  if (!verifiedPayload) return ResponseHandler.error("Invalid or Expired Token");

  const user = await UserModel.findOne({ email: verifiedPayload.email });
  if (!user) {
    return ResponseHandler.error("User Account not found");
  }

  user.password_hash = password;

  await user.save();

  const cookieStore = await cookies();
  cookieStore.delete("resetToken");

  return ResponseHandler.success(null, "Password Reset Successfully!");
}
