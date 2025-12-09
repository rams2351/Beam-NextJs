// app/api/check/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { url } = await request.json();

  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      validateStatus: () => true, // Resolve all statuses (404, 500, etc)
    });

    const finalUrl = response.request?.res?.responseUrl || url;

    // Helper to normalize URLs for comparison (remove trailing slashes)
    const normalize = (u: string) => u.toLowerCase().replace(/\/+$/, "");

    const originalNorm = normalize(url);
    const finalNorm = normalize(finalUrl);
    const homeNorm = normalize("https://coloringonly.com");

    let status = "OK";
    let isBroken = false;

    // Logic: Identify "Bad" Redirects
    if (response.status === 404) {
      status = "404 Not Found";
      isBroken = true;
    } else if (finalNorm === homeNorm && originalNorm !== homeNorm) {
      status = "Redirected to Home";
      isBroken = true;
    } else if (response.status !== 200) {
      status = `Status ${response.status}`;
      isBroken = true;
    }

    return NextResponse.json({
      originalUrl: url,
      finalUrl: finalUrl,
      status: status,
      isBroken: isBroken,
    });
  } catch (error: any) {
    return NextResponse.json({
      originalUrl: url,
      finalUrl: null,
      status: "Network Error",
      isBroken: true,
    });
  }
}
