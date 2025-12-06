import { getAccessToken, getRefreshToken } from "@/lib/cookies";
import { IUser, IUserDocument } from "@/types/user.types";
import jwt, { SignOptions } from "jsonwebtoken";
import { Document } from "mongoose";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_TOKEN_SECRET!;

interface MongoUser extends Document, Omit<IUser, "_id"> {}
if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("Missing Token Secrets in .env file");
}

export interface JWTPayload {
  _id: string;
  name: string;
  email: string;
  // If you want to add 'role' or 'avatar' later, ADD IT HERE ONLY.
}

const normalizePayload = (data: IUserDocument | JWTPayload): JWTPayload => {
  // Check if it's already a clean payload (doesn't have mongoose methods like save)
  const isMongooseDocument = (d: any): d is IUserDocument => {
    return d && typeof d.toObject === "function";
  };

  if (isMongooseDocument(data)) {
    // Extract strictly what we need from the full DB document
    return {
      _id: data._id.toString(), // Ensure ID is string
      name: data.name,
      email: data.email,
    };
  }

  // It's already a plain object/payload
  return {
    _id: data._id.toString(),
    name: data.name,
    email: data.email,
  };
};

// Helper to handle "15m" (string) or 900 (number)
const getExpiry = (envVal: string | undefined, defaultVal: string | number) => {
  if (!envVal) return defaultVal;
  // If it's just numbers, parse it. If it has letters (m/h/d), keep string.
  return isNaN(Number(envVal)) ? (envVal as any) : Number(envVal);
};

export function signAccessToken(data: IUserDocument | JWTPayload) {
  const payload = normalizePayload(data); // <--- AUTOMATIC CLEANUP

  const options: SignOptions = {
    expiresIn: "15m",
  };
  return jwt.sign(payload, ACCESS_SECRET, options);
}

export function signRefreshToken(data: IUserDocument | JWTPayload) {
  const payload = normalizePayload(data); // <--- AUTOMATIC CLEANUP

  const options: SignOptions = {
    expiresIn: "7d",
  };
  return jwt.sign(payload, REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
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

export async function getValidAccessToken(): Promise<string | null> {
  // 1. Try existing Access Token
  const accessToken = await getAccessToken();

  if (accessToken) {
    const payload = verifyAccessToken(accessToken);
    if (payload) {
      return accessToken; // It's valid, use it.
    }
  }

  // 2. Access Token is expired or missing. Try Refresh Token.
  console.log("⚠️ Access Token expired in Layout. Attempting silent refresh for Socket...");

  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null; // User is logged out

  const refreshPayload = verifyRefreshToken(refreshToken);
  if (!refreshPayload) return null; // Refresh token is also invalid

  // 3. Generate a NEW Access Token String
  // We cannot "Set-Cookie" in a Server Component layout easily,
  // but we CAN return a valid string for the Socket to use immediately.
  const newPayload = {
    _id: refreshPayload._id,
    name: refreshPayload.name,
    email: refreshPayload.email,
  };

  const newAccessToken = signAccessToken(newPayload);

  return newAccessToken;
}
