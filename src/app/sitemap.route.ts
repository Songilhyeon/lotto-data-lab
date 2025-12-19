import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://app.nexlab.ai.kr";
  // 정적 페이지
  const staticUrls = [
    { url: "/", changefreq: "weekly", priority: 1.0 },
    { url: "/analyze", changefreq: "weekly", priority: 0.9 },
    { url: "/ai-recommend", changefreq: "weekly", priority: 0.8 },
    { url: "/winner-stores", changefreq: "weekly", priority: 0.6 },
    { url: "/lotto-history", changefreq: "weekly", priority: 0.6 },
    { url: "/board", changefreq: "daily", priority: 0.7 },
  ];

  const xmlUrls = staticUrls
    .map(
      (page) => `
<url>
  <loc>${siteUrl}${page.url}</loc>
  <changefreq>${page.changefreq}</changefreq>
  <priority>${page.priority}</priority>
</url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
