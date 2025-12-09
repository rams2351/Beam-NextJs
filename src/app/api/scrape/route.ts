import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const uniqueLinks = new Set<string>();

    // 🎯 TARGET SPECIFIC CONTAINER
    // Only select anchor tags inside <div class="container">
    const selector = ".container a";

    $(selector).each((_, element) => {
      let href = $(element).attr("href");

      if (href) {
        href = href.trim();

        // 1. FILTER: Ignore useless links
        if (href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:") || href === "#" || href === "") {
          return;
        }

        try {
          // 2. NORMALIZE: Convert relative paths to Absolute URLs
          // This handles href="/category/foo" -> "https://coloringonly.com/category/foo"
          const absoluteUrl = new URL(href, url).href;
          uniqueLinks.add(absoluteUrl);
        } catch (e) {
          // Ignore invalid URLs
        }
      }
    });

    const extractedLinks = Array.from(uniqueLinks);

    return NextResponse.json({
      success: true,
      total: extractedLinks.length,
      links: extractedLinks,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
