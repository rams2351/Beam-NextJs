import { cookies } from "next/headers";

export const COOKIE_KEYS = {
  access: "accessToken",
  refresh: "refreshToken",
  id: "idToken",
  reset: "resetPasswordToken",
};

const isProd = process.env.NODE_ENV === "production";

const defaultOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const, // 'lax' is usually better than 'strict' for redirects
  path: "/",
};

export async function getAccessToken() {
  const store = await cookies();
  return store.get(COOKIE_KEYS.access)?.value || null;
}

export async function getRefreshToken() {
  const store = await cookies();
  return store.get(COOKIE_KEYS.refresh)?.value || null;
}

export async function setTokens({ accessToken, refreshToken }: { accessToken?: string; refreshToken?: string }) {
  const store = await cookies();
  if (accessToken) store.set(COOKIE_KEYS.access, accessToken, defaultOptions);
  if (refreshToken)
    store.set(COOKIE_KEYS.refresh, refreshToken, {
      ...defaultOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 Days
    });
}

export async function setResetPasswordTokenInCookies(token: string) {
  const store = await cookies();
  store.set(COOKIE_KEYS.reset, token, defaultOptions);
}

export async function getResetPasswordTokenFromCookies() {
  const store = await cookies();
  return store.get(COOKIE_KEYS.reset)?.value || null;
}

export async function clearTokens() {
  const store = await cookies();
  store.delete(COOKIE_KEYS.access);
  store.delete(COOKIE_KEYS.refresh);
  store.delete(COOKIE_KEYS.id);
  store.delete(COOKIE_KEYS.reset);
}
