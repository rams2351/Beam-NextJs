import { IUser } from "@/types/auth";
import jwt, { SignOptions } from "jsonwebtoken";
import { Document } from "mongoose";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_TOKEN_SECRET!;

interface MongoUser extends Document, Omit<IUser, "_id"> {}
if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("Missing Token Secrets in .env file");
}

// Helper to handle "15m" (string) or 900 (number)
const getExpiry = (envVal: string | undefined, defaultVal: string | number) => {
  if (!envVal) return defaultVal;
  // If it's just numbers, parse it. If it has letters (m/h/d), keep string.
  return isNaN(Number(envVal)) ? (envVal as any) : Number(envVal);
};

export function signAccessToken(user: MongoUser) {
  const options: SignOptions = {
    expiresIn: getExpiry(process.env.ACCESS_TOKEN_EXPIRY, "15m"),
  };
  return jwt.sign(user, ACCESS_SECRET, options);
}

export function signRefreshToken(user: MongoUser) {
  const options: SignOptions = {
    expiresIn: getExpiry(process.env.REFRESH_TOKEN_EXPIRY, "7d"),
  };
  return jwt.sign(user, REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET) as MongoUser;
  } catch (error) {
    return null; // Returns null if expired or invalid
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_SECRET) as MongoUser;
  } catch (error) {
    return null;
  }
}

export function signResetPasswordToken(email: string) {
  try {
    const options: SignOptions = {
      expiresIn: getExpiry(process.env.RESET_PASSWORD_TOKEN_EXPIRY, "15m"),
    };
    return jwt.sign({ email }, RESET_PASSWORD_SECRET, options);
  } catch {
    return null;
  }
}

export function verifyResetPasswordToken(token: string) {
  try {
    return jwt.verify(token, RESET_PASSWORD_SECRET) as MongoUser;
  } catch {
    return null;
  }
}
