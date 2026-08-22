import { MetadataRoute } from 'next';
import { getAllChapters } from '@/lib/chapters';
import { getAllDailyRecords } from '@/lib/daily_records';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://www.thevenetiaproject.com'
  ).replace(/\/$/, '');

  /*
   * Only include canonical, indexable pages.
   *
   * Add lastModified ONLY when we know the page had a
   * meaningful content / structured-data / linking update.
   */
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
    },
    {
      url: `${baseUrl}/venetia`,
      // Major biography + SEO update
      lastModified: new Date('2026-08-22'),
    },
    {
      url: `${baseUrl}/venetia-stanley-edwin-montagu-marriage`,
    },
    {
      url: `${baseUrl}/venetia-stanley-after-1915`,
    },
    {
      url: `${baseUrl}/edwin-montagu-precipice`,
    },
    {
      url: `${baseUrl}/precipice-fact-vs-fiction`,
    },
    {
      url: `${baseUrl}/franz-von-papen`,
    },
    {
      url: `${baseUrl}/essentials`,
    },
    {
      url: `${baseUrl}/1914-diary`,
    },
    {
      url: `${baseUrl}/data-room`,
    },
    {
      url: `${baseUrl}/about`,
    },
    {
      url: `${baseUrl}/lab`,
    },
  ];

  // Historical chapters
  const chapters = await getAllChapters();

  const chapterRoutes: MetadataRoute.Sitemap = chapters.map((chapter) => ({
    url: `${baseUrl}/chapter/${encodeURIComponent(chapter.slug)}`,
  }));

  // Only daily archive pages that actually contain letters
  const dailyRecords = await getAllDailyRecords();

  const dailyRoutes: MetadataRoute.Sitemap = dailyRecords
    .filter((record) => record?.letters?.length)
    .map((record) => ({
      url: `${baseUrl}/daily/${encodeURIComponent(record.date)}`,
    }));

  return [...staticRoutes, ...chapterRoutes, ...dailyRoutes];
}