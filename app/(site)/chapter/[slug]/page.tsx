import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getAllChapters, getChapterBySlugOrChapterId } from '@/lib/chapters';
import ChapterView from '@/components/chapter/ChapterView';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const chapters = await getAllChapters();
  return chapters.map((chapter) => ({
    slug: chapter.slug,
  }));
}

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const { slug } = await props.params;
  const chapter = await getChapterBySlugOrChapterId(slug);

  if (!chapter) return { title: 'Chapter Not Found | The Venetia Project' };

  return {
    title: `${chapter.chapter_title} | The Venetia Project`,
    description: chapter.main_story
      ? `${chapter.main_story.substring(0, 160)}...`
      : 'A chapter from the Venetia Project.',
    alternates: {
      canonical: `/chapter/${chapter.slug}`,
    },
    openGraph: {
      title: chapter.chapter_title,
      description: chapter.main_story
        ? `${chapter.main_story.substring(0, 160)}...`
        : undefined,
      url: `/chapter/${chapter.slug}`,
    }
  };
}

export default async function ChapterSlugPage(props: Props) {
  const { slug } = await props.params;
  const chapter = await getChapterBySlugOrChapterId(slug);

  if (!chapter) {
    notFound();
  }

  if (slug !== chapter.slug) {
    permanentRedirect(`/chapter/${encodeURIComponent(chapter.slug)}`);
  }

  return <ChapterView chapterData={chapter as any} />;
}
