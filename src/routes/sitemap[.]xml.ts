import { createFileRoute } from "@tanstack/react-router";

import { LEGAL } from "@/data/legal";
import { fetchPublishedPosts } from "@/lib/blog";
import { ORIGIN as BASE_URL } from "@/site.config";
import type {} from "@tanstack/react-start";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

/**
 * Only pages that are actually indexable belong here. Routes still carrying
 * noindex are deliberately absent until they are finished.
 */
const CONTENT_PAGES: readonly SitemapEntry[] = [
  { path: "/salon-booking-software-australia", changefreq: "monthly", priority: "0.9" },
  { path: "/hair-salon-software-australia", changefreq: "monthly", priority: "0.9" },
  { path: "/commission-free-booking-software", changefreq: "monthly", priority: "0.9" },
  { path: "/no-monthly-fee-salon-software", changefreq: "monthly", priority: "0.9" },
  { path: "/about", changefreq: "yearly", priority: "0.5" },
  { path: "/get-in-touch", changefreq: "monthly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.6" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await fetchPublishedPosts();

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          ...CONTENT_PAGES,
          ...posts.map<SitemapEntry>((p) => ({
            path: `/blog/${encodeURIComponent(p.slug)}`,
            ...(p.updated_at ? { lastmod: p.updated_at } : {}),
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          { path: "/legal", changefreq: "yearly", priority: "0.3" },
          // Generated from the same list the pages are, so a new policy is
          // in the sitemap the moment it exists.
          ...LEGAL.map<SitemapEntry>((d) => ({
            path: `/legal/${d.slug}`,
            changefreq: "yearly",
            priority: "0.2",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
