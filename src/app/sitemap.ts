import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://app.nexlab.ai.kr";
  const buildTime =
    process.env.NEXT_PUBLIC_BUILD_TIME ?? process.env.BUILD_TIME ?? null;
  const lastModified = buildTime ? new Date(buildTime) : new Date("2024-01-01");

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/analyze`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/ai-recommend`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/winner-stores`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/lotto-history`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/board`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];
}
