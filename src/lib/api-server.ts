import UserModel from "@/database/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getRefreshToken, setTokens } from "./cookies";
import { JWTPayload, signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "./jwt";
import connectMongoDb from "./mongoose";

interface ApiResponseStructure<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export class ResponseHandler {
  static success<T>(data: T, message = "Success", status = 200) {
    return NextResponse.json<ApiResponseStructure<T>>({ success: true, message, ...(data ? data : null) }, { status });
  }

  static error(message: string, status = 400) {
    return NextResponse.json<ApiResponseStructure<null>>({ success: false, message }, { status });
  }
}

// Next.js 15 Params are Promises
type RouteContext = { params: Promise<any> };

type AuthenticatedHandler = (req: NextRequest, context: RouteContext, user: any) => Promise<NextResponse>;

export function apiRequestHandler(handler: AuthenticatedHandler, authenticateRoute: boolean = true) {
  return async (req: NextRequest, context: RouteContext) => {
    try {
      // 1. Connect to Database (Global connection)
      await connectMongoDb();

      let mongoUser = null;

      // ======================================================
      // 2. AUTHENTICATION LOGIC
      // ======================================================
      if (authenticateRoute) {
        let accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        if (!accessToken && !refreshToken) {
          return ResponseHandler.error("Unauthorized: No tokens found", 401);
        }

        // Try to verify existing access token
        let payload: JWTPayload | null = accessToken ? verifyAccessToken(accessToken) : null;

        // If Access Token is invalid/expired, try Refresh Flow
        if (!payload) {
          if (!refreshToken) {
            return ResponseHandler.error("Session expired", 401);
          }

          console.log("Access token expired. Attempting refresh...");

          // A. Verify Refresh Token Signature
          const refreshPayload = verifyRefreshToken(refreshToken);
          if (!refreshPayload) {
            return ResponseHandler.error("Invalid refresh token", 401);
          }

          // B. Get User from DB
          mongoUser = await UserModel.findById(refreshPayload._id);

          if (!mongoUser) {
            return ResponseHandler.error("User not found", 401);
          }

          // C. Token Rotation: Issue NEW tokens
          // Fix: Ensure payload maps _id -> userId correctly for the JWT util
          const tokenPayload = mongoUser?.toObject();

          const newAccessToken = signAccessToken(tokenPayload);
          // Refresh token only needs userId
          const newRefreshToken = signRefreshToken(tokenPayload);

          // D. Update Cookies
          await setTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });

          // E. Set payload for the current request context
          payload = { _id: tokenPayload?._id.toString(), name: tokenPayload.name, email: tokenPayload.email };
        }

        // ======================================================
        // 3. USER HYDRATION
        // ======================================================
        if (payload && !mongoUser) {
          mongoUser = await UserModel.findById(payload);
        }

        if (!mongoUser) {
          return ResponseHandler.error("User not found", 404);
        }
      }

      // ======================================================
      // 4. EXECUTE HANDLER
      // ======================================================
      // We do NOT need a try-catch here.
      // If handler() throws, it bubbles up to the main catch block below.
      return await handler(req, context, mongoUser);
    } catch (error: any) {
      console.error(`[API Error] ${req.nextUrl.pathname}:`, error);

      // OPTIONAL: If you want to support throwing custom status codes from controllers,
      // you can check for a 'status' property on the error object here.
      // const status = error.status || 500;

      return ResponseHandler.error(error.message || "Internal Server Error", 500);
    }
  };
}
