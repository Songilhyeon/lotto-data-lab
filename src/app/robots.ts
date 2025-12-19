import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const robotsTxt = `User-Agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: { "Content-Type": "text/plain" },
  });
}
