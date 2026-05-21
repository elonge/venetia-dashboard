import { STATIC_CHAPTERS } from './static-chapters';
import { Chapter } from '@/types/chapter';

// Re-export types for backward compatibility
export * from '@/types/chapter';

/**
 * Fetch all chapters (static)
 */
export async function getAllChapters(): Promise<Chapter[]> {
  return STATIC_CHAPTERS;
}

/**
 * Fetch a specific chapter by ID (static)
 */
export async function getChapterById(id: string): Promise<Chapter | null> {
  const chapter = STATIC_CHAPTERS.find(c => c._id === id);
  return chapter || null;
}

/**
 * Fetch a chapter by chapter_id (static)
 */
export async function getChapterByChapterId(chapterId: string): Promise<Chapter | null> {
  const chapter = STATIC_CHAPTERS.find(c => c.chapter_id === chapterId);
  return chapter || null;
}

/**
 * Fetch a chapter by slug (static)
 */
export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  const chapter = STATIC_CHAPTERS.find(c => c.slug === slug);
  return chapter || null;
}

/**
 * Fetch a chapter by either slug or legacy chapter_id (static)
 */
export async function getChapterBySlugOrChapterId(identifier: string): Promise<Chapter | null> {
  const chapter = STATIC_CHAPTERS.find(
    c => c.slug === identifier || c.chapter_id === identifier
  );
  return chapter || null;
}
