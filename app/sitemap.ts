import { MetadataRoute } from 'next';
import { getAllChapters } from '@/lib/chapters';
import { getAllDailyRecords } from '@/lib/daily_records';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.thevenetiaproject.com';

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/1914-diary`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lab`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/data-room`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/venetia`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/essentials`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/precipice-fact-vs-fiction`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/franz-von-papen`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/edwin-montagu-precipice`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }
  ];

  // 2. Dynamic Chapter Routes
  const chapters = await getAllChapters();
  const chapterRoutes: MetadataRoute.Sitemap = chapters.map((chapter) => ({
    url: `${baseUrl}/chapter?chapter_id=${encodeURIComponent(chapter.chapter_id)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // 3. Dynamic Daily Entry Routes
  const dailyRecords = await getAllDailyRecords();
  const interestingDailyRecords = dailyRecords.filter(record => (record?.letters?.length && record.letters.length > 0));
  const dailyRoutes: MetadataRoute.Sitemap = interestingDailyRecords.map((record) => ({
    url: `${baseUrl}/daily/${encodeURIComponent(record.date)}`,
    lastModified: new Date(), // Ideally this would be record.last_modified if available
    changeFrequency: 'never', // Historical records rarely change
    priority: 0.5,
  }));

  return [...staticRoutes, ...chapterRoutes, ...dailyRoutes];
}
