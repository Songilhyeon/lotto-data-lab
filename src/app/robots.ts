import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const xml = `User-Agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "text/plain" },
  });
}
