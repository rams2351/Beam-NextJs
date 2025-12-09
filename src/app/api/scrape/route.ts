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

    // 1. Hostname Logic
    const targetUrlObj = new URL(url);
    const targetHostname = targetUrlObj.hostname.replace("www.", "");

    // 2. Select ALL anchors in body
    const selector = "body a";

    $(selector).each((_, element) => {
      let href = $(element).attr("href");

      if (href) {
        href = href.trim();

        // 3. Filter useless links
        if (href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:") || href === "#" || href === "") {
          return;
        }

        try {
          // 4. Normalize to Absolute URL
          const absoluteUrlObj = new URL(href, url);
          const absoluteUrl = absoluteUrlObj.href;

          // 5. Domain Check
          const linkHostname = absoluteUrlObj.hostname.replace("www.", "");

          if (linkHostname.includes(targetHostname)) {
            // 🛠️ FIX: Do NOT remove trailing slashes.
            // If the HTML has "/category/animals/", we keep it exactly like that.
            // This ensures we check the EXACT link the website is using.
            uniqueLinks.add(absoluteUrl);
          }
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
